import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";

import { Message } from "../types/Message";
import { RouteProp } from "@react-navigation/native";

import AppView from "../components/common/AppView";
import AppButton from "../components/common/AppButton";
import AppText from "../components/common/AppText";
import { ColorsGlobal } from "../components/base/Colors/ColorsGlobal";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/data/store";
import { confirmPointAction } from "../redux/slices/pointSlice";
import { useSocket } from "../context/SocketContext";
import Container from "../components/common/Container";
import AppInput from "../components/common/AppInput";
import IconSent from "../assets/icons/IconSent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../context/AppContext";

type RootStackParamList = {
  Chat: { data: string };
};

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

interface Props {
  route: ChatRouteProp;
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = route?.params;
  console.log('data chat screen', data)
  const { currentDriver } = useAppContext();

  console.log('currentDriver in chat screen', currentDriver)

  const currentUserId = currentDriver?.id // ví dụ: người mua là người đang login
  const chatWith =
    currentUserId === data?.buyer_id ? data?.seller_id : data?.buyer_id;
  console.log(chatWith, 'chatWith id')
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const idPoint = data?.id;

  const isOnwer = currentUserId === data?.seller_id;
  console.log('first currentUserId in chat screen', isOnwer)
  const nameChatWith = isOnwer ? data?.buyer.full_name : data?.seller.full_name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${nameChatWith}`,
    });
  }, [navigation, data?.buyer?.full_name]);

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket chưa sẵn sàng");
      return;
    }

    console.log("✅ Setting up socket listeners, socket id:", socket.id);

    socket.on("connect", () => {
      console.log("🔌 Socket connected, id:", socket.id);
      socket.emit("register_user", currentUserId);
      console.log("📌 Register user:", currentUserId);
    });

    // ✅ QUAN TRỌNG: Nếu đã connected rồi thì emit luôn
    if (socket.connected) {
      socket.emit("register_user", currentUserId);
      console.log("📌 Register user (already connected):", currentUserId);
    }

    return () => {
      socket.off("connect");
    };
  }, [socket, currentUserId]);


  // Load messages
  useEffect(() => {
    if (!socket || !socket.connected) {
      console.log("⚠️ Socket not ready for loading messages");
      return;
    }

    console.log("🔄 Loading chat messages...");
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
      console.log("📨 msg.sender_id === currentUserId && msg.receiver_id === chatWith):", msg.sender_id == currentUserId && msg.receiver_id === chatWith);
      console.log("📨 msg.sender_id === chatWith && msg.receiver_id === currentUserId:", msg.sender_id === chatWith && msg.receiver_id == currentUserId);
      if (
        (msg.sender_id === currentUserId && msg.receiver_id === chatWith) ||
        (msg.sender_id === chatWith && msg.receiver_id === currentUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("load_messages", handleLoadMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("load_messages", handleLoadMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentUserId, chatWith]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!socket) {
      console.error("❌ Socket is null!");
      Alert.alert("Lỗi", "Chưa kết nối tới server");
      return;
    }

    if (!socket.connected) {
      console.error("❌ Socket not connected!");
      Alert.alert("Lỗi", "Mất kết nối tới server");
      return;
    }

    console.log("✅ Socket connected:", socket.id);
    console.log("📤 Emitting send_message...");

    const payload = {
      sender_id: currentUserId,
      receiver_id: chatWith,
      text: message,
    };

    console.log("📦 Payload:", payload);

    socket.emit("send_message", payload, (response: any) => {
      // ✅ Callback để xác nhận server nhận được
      console.log("✅ Server acknowledged:", response);
    });

    setMessage("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === currentUserId;
    // Sửa tên trường phù hợp với server
    const time = item.created_at // ✅ Dùng created_at thay vì createdAt
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
        {!isMine && <Text style={styles.sender}>{item.user}</Text>}
        <View
          style={[
            styles.bubble,
            isMine ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

    );
  };

  const handleConfirm = async () => {

    const resultAction = await dispatch(confirmPointAction(idPoint));
    console.log('resultAction', resultAction)
    if (confirmPointAction.fulfilled.match(resultAction)) {
      // Thành công
      Alert.alert('Thành công', 'Xác nhận điểm thành công');
    } else {
      // Thất bại
      Alert.alert('Lỗi', resultAction.payload || 'Xác nhận thất bại');
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
    <Container  >
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListHeaderComponent={isOnwer ? ListHeaderComponent : undefined}
      />
      <AppView row alignItems="center" >
        <AppView flex={1} height={40}>
          <AppInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={{ paddingTop: 0, borderWidth: 1 }}
          ></AppInput>
        </AppView>

        <AppButton onPress={sendMessage} >
          <IconSent />
        </AppButton>
      </AppView>

    </Container>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },

  msgContainer: {
    marginVertical: 3,
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
    color: "black",
  },
  sender: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
  },
  time: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 6,
    marginTop: 6,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: "#fff",

  },
});
