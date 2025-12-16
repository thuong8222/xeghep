import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { Message } from "../types/Message";
import { RouteProp } from "@react-navigation/native";

import AppView from "../components/common/AppView";
import AppButton from "../components/common/AppButton";
import AppText from "../components/common/AppText";
import { ColorsGlobal } from "../components/base/Colors/ColorsGlobal";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/data/store";
import { confirmPointAction } from "../redux/slices/pointSlice";
import { useSocket } from "../context/SocketContext";
import Container from "../components/common/Container";
import AppInput from "../components/common/AppInput";
import IconSent from "../assets/icons/IconSent";
import { useAppContext } from "../context/AppContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import IconPhone from "../assets/icons/iconPhone";
import ModalUploadCarImage from "../components/component/modals/ModalUploadCarImage";

// ⚠️ CẤU HÌNH IP SERVER
const API_BASE_URL = 'http://15.235.167.241:5000'; // ⭐ Server IP của bạn

type ChatRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

interface Props {
  route: ChatRouteProp;
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = route?.params;
  const { currentDriver } = useAppContext();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const currentUserId = currentDriver?.id;
  const buyer_id = data?.buyer_id || data?.id_driver_receive || data?.driver_receive?.id;
  const seller_id = data?.seller_id || data?.id_driver_sell || data?.driver_sell?.id_driver;
  // const chatWith = currentUserId === data?.buyer_id ? data?.seller_id : data?.buyer_id;
  const chatWith = currentUserId === buyer_id ? seller_id : buyer_id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);

  const idPoint = data?.id;
  const isOnwer = currentUserId === seller_id;
  const name_buyer = data?.buyer?.full_name || data?.driver_receive?.full_name;
  const name_seller = data?.seller?.full_name || data?.driver_sell?.full_name;
  // const nameChatWith = isOnwer ? data?.buyer.full_name : data?.seller.full_name;
  const nameChatWith = isOnwer ? name_buyer : name_seller;
  const phone_buyer = data?.buyer?.phone || data?.driver_receive?.phone;
  const phone_seller = data?.seller?.phone || data?.driver_sell?.phone;
  const callToPhone = () => {
    const phoneNumber = isOnwer ? phone_buyer : phone_seller;
    if (!phoneNumber) {
      Alert.alert("Lỗi", "Không có số điện thoại");
      return;
    }
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert("Lỗi", "Không thể mở ứng dụng gọi điện");
        } else {
          Linking.openURL(phoneUrl);
        }
      })
      .catch(err => console.error("Call error:", err));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: nameChatWith,
      headerRight: () => (
        <TouchableOpacity onPress={callToPhone} style={{ padding: 6, marginRight: 12 }}>
          <IconPhone width={24} height={24} rotate={0} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, nameChatWith, isOnwer, data?.buyer?.phone, data?.seller?.phone]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🔌 Socket connected");
      socket.emit("register_user", currentUserId);
    });

    if (socket.connected) {
      socket.emit("register_user", currentUserId);
    }

    return () => {
      socket.off("connect");
    };
  }, [socket, currentUserId]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket.emit("load_chat_messages", {
      user_id: currentUserId,
      chatWith: chatWith,
    });

    const handleLoadMessages = (msgs: Message[]) => {
      console.log("📜 Loaded messages:", msgs.length);
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: Message) => {
      console.log("📨 Received message:", msg);
      if (
        (msg.sender_id === currentUserId && msg.receiver_id === chatWith) ||
        (msg.sender_id === chatWith && msg.receiver_id === currentUserId)
      ) {
        // ⭐ Tránh duplicate: Kiểm tra xem message đã tồn tại chưa
        setMessages((prev) => {
          const exists = prev.some(m => m.id === msg.id);
          if (exists) {
            console.log("⚠️ Message already exists, skipping:", msg.id);
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    socket.on("load_messages", handleLoadMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("load_messages", handleLoadMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentUserId, chatWith]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handlePointConfirmed = (data: any) => {
      if (data.buyer_id === currentUserId) {
        Alert.alert(
          "✅ Giao dịch thành công",
          data.message || "Người bán đã xác nhận bán điểm",
          [{ text: "OK" }]
        );
      }
    };

    socket.on("point_sale_confirmed", handlePointConfirmed);
    return () => {
      socket.off("point_sale_confirmed", handlePointConfirmed);
    };
  }, [socket, currentUserId]);

  // 📤 Gửi tin nhắn - HỖ TRỢ CẢ TEXT VÀ IMAGE CÙNG LÚC
  const sendMessage = async () => {
    if (!socket || !socket.connected) {
      Alert.alert("Lỗi", "Chưa kết nối tới server");
      return;
    }

    // ⭐ Kiểm tra: phải có ít nhất text hoặc image
    if (!message.trim() && !selectedImage) {
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = null;

      // 1️⃣ Nếu có ảnh, upload trước
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // 2️⃣ Gửi tin nhắn qua socket (có thể có cả text và image)
      const payload = {
        sender_id: currentUserId,
        receiver_id: chatWith,
        text: message.trim() || null, // ⭐ Text có thể null nếu chỉ gửi ảnh
        image_url: imageUrl, // ⭐ Image có thể null nếu chỉ gửi text
      };

      console.log("📤 Sending message:", payload);

      socket.emit("send_message", payload, (response: any) => {
        console.log("✅ Server response:", response);
        if (response?.error) {
          Alert.alert("Lỗi", response.error);
        }
      });

      // 3️⃣ Reset form
      setMessage("");
      setSelectedImage(null);

    } catch (error) {
      console.error('❌ Send message error:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn');
    } finally {
      setIsUploading(false);
    }
  };

  // 🔧 Hàm upload ảnh riêng biệt
  const uploadImage = async (imageUri: string): Promise<string> => {
    try {
      const formData = new FormData();

      // ⭐ Fix: Thêm đầy đủ thông tin file
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `chat_${Date.now()}.jpg`,
      } as any);

      console.log("📤 Uploading image to:", `${API_BASE_URL}/api/upload/chat-image`);
      console.log("📦 Image URI:", imageUri);

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/chat-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("📥 Upload response status:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("❌ Upload failed:", errorText);
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("✅ Upload result:", uploadResult);

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'No URL returned');
      }

      console.log("✅ Image uploaded:", uploadResult.url);
      return uploadResult.url;

    } catch (error: any) {
      console.error('❌ Upload image error:', error);
      console.error('❌ Error message:', error.message);

      if (error.message.includes('Network request failed')) {
        Alert.alert(
          'Lỗi kết nối',
          'Không thể kết nối tới server. Kiểm tra:\n' +
          '1. Server đang chạy\n' +
          '2. Địa chỉ IP đúng\n' +
          '3. Điện thoại và server cùng mạng'
        );
      }

      throw error;
    }
  };

  // 🎨 Render tin nhắn
  const renderItem = ({ item }: { item: Message }) => {
    // console.log('item chat: ', item)
    const isMine = item.sender_id === currentUserId;
    const time = item.created_at
      ? new Date(item.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "";

    return (
      <View
        style={[
          styles.msgContainer,
          isMine ? styles.myMsgContainer : styles.otherMsgContainer,
        ]}
      >
        {!isMine && <Text style={styles.sender}>{nameChatWith || 'Unknown'}</Text>}
        <View
          style={[
            styles.bubble,
            isMine ? styles.myBubble : styles.otherBubble,
          ]}
        >
        
          {/* 🖼️ Hiển thị ảnh nếu có */}
          {item.image_url && (
            <TouchableOpacity onPress={() => setPreviewImage(item?.image_url)}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {/* 📝 Hiển thị text (caption) */}
          {item.text && (
            <Text style={[styles.text, { color: isMine ? 'white' : 'black' }]}>
              {item.text}
            </Text>
          )}

          <Text style={[styles.time, { color: isMine ? 'rgba(255,255,255,0.7)' : '#555' }]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  const handleConfirm = async () => {
    if (!idPoint) {
      Alert.alert("Lỗi", "Không tìm thấy ID giao dịch");
      return;
    }

    if (!isOnwer) {
      Alert.alert("Lỗi", "Bạn không phải người bán");
      return;
    }

    if (data?.status === 'completed') {
      Alert.alert("Thông báo", "Giao dịch đã được xác nhận trước đó");
      return;
    }

    try {
      const resultAction = await dispatch(confirmPointAction(idPoint));

      if (confirmPointAction.fulfilled.match(resultAction)) {
        Alert.alert(
          "Thành công",
          "Bạn đã xác nhận bán điểm",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        const errorMessage = resultAction.payload as string || "Xác nhận thất bại";
        Alert.alert("Lỗi", errorMessage);
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi không mong muốn");
    }
  };

  const ListHeaderComponent = () => {
    return (
      <AppView radius={16} padding={16} gap={6} backgroundColor={ColorsGlobal.backgroundGray}>
        <AppView row justifyContent={'space-between'}>
          <AppText fontSize={14}>{'Khách mua: '}</AppText>
          <AppText fontSize={14}>{data?.buyer?.full_name + ' - ' + data?.buyer?.phone}</AppText>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText fontSize={14}>{'Điểm bán: '}</AppText>
          <AppText fontSize={14}>{data?.points_amount + ' Điểm'}</AppText>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppButton>
            <AppText fontSize={14} color={ColorsGlobal.main}>{'Huỷ'}</AppText>
          </AppButton>
          <AppButton onPress={handleConfirm}>
            <AppText fontSize={14} color={ColorsGlobal.main2}>{'Xác nhận bán'}</AppText>
          </AppButton>
        </AppView>
      </AppView>
    )
  }

  return (
    <>
      {previewImage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            onPress={() => setPreviewImage(null)}
            style={{ position: "absolute", top: 40, right: 20 }}
          >
            <Text style={{ fontSize: 30, color: "white" }}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: previewImage }}
            style={{ width: "90%", height: "70%", resizeMode: "contain" }}
          />
        </View>
      )}


      <Container padding={0}>
    {isOnwer &&  <ListHeaderComponent />} 
        <FlatList
          data={messages}
          keyExtractor={(item, i) => item.id || i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{padding:8}}
          // ListHeaderComponent={isOnwer ? ListHeaderComponent : undefined}
        />

        {/* 🖼️ Preview ảnh đã chọn */}
        {selectedImage && (
          <AppView padding={10} backgroundColor={ColorsGlobal.backgroundLight}>
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          </AppView>
        )}

        {/* ⌨️ Input area */}
        <AppView row alignItems="center" gap={5} >
          {/* 📎 Button chọn ảnh */}
          <AppButton onPress={() => setIsDisplayModalUploadImage(true)}>
            <Text style={{ fontSize: 24 }}>📎</Text>
          </AppButton>

          <AppView flex={1}>
            <AppInput
              value={message}
              onChangeText={setMessage}
              placeholder="Nhập tin nhắn..."
              multiline
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: ColorsGlobal.backgroundLight,
                borderRadius: 20,
                minHeight: 40,
                marginTop: -10
              }}
            />
          </AppView>

          {/* 📤 Button gửi */}
          <AppButton onPress={sendMessage} disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator size="small" color={ColorsGlobal.main} />
            ) : (
              <IconSent color={ColorsGlobal.main} />
            )}
          </AppButton>
        </AppView>

        <ModalUploadCarImage
          isDisplay={isDisplayModalUploadImage}
          onClose={() => setIsDisplayModalUploadImage(false)}
          onSelectImage={(uri) => {
            setSelectedImage(uri);
            setIsDisplayModalUploadImage(false);
          }}
        />
      </Container>
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  msgContainer: {
    marginVertical: 3,
    paddingHorizontal: 10,
  },
  myMsgContainer: {
    alignItems: "flex-end",
  },
  otherMsgContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
  },
  myBubble: {
    backgroundColor: "#0078fe",
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#e5e5ea",
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 15,
  },
  sender: {
    fontSize: 12,
    marginLeft: 0,
    marginBottom: 2,
    color: "#555",
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 5,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});