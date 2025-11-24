import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";
import socket from "../services/socket";
import { Message } from "../types/Message";
import { RouteProp } from "@react-navigation/native";
import Container from "../components/common/Container";
import AppInput from "../components/common/AppInput";
import AppView from "../components/common/AppView";
import AppButton from "../components/common/AppButton";
import AppText from "../components/common/AppText";
import { ColorsGlobal } from "../components/base/Colors/ColorsGlobal";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/data/store";
import { confirmPointAction } from "../redux/slices/pointSlice";
import { useDriverApi } from "../redux/hooks/userDriverApi";

type RootStackParamList = {
  Chat: { data: string };
};

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

interface Props {
  route: ChatRouteProp;
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { data } = route.params;

  console.log('data ChatScreen: ', data)
const { driver,getDriver } = useDriverApi();






  // Lấy thông tin driver khi vào màn hình
  useEffect(() => {
    if (!driver) {
      getDriver().catch(err => {
        console.log('Lỗi lấy thông tin driver:', err);
      });
    }
  }, [driver]);
console.log('driver  ChatScreen: ',driver);

const myId  = driver
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toUser, setToUser] = useState("user2");

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: `${}`,
  //   });
  // }, [navigation ]);

  // 1️⃣ Register user & setup listeners
  useEffect(() => {
    if (!data?.seller_id || !myId) return;
  
    socket.emit("register_user", myId);
  
    socket.on("connect", () => {
      console.log("✅ Connected to server");
    });
  
    // Load chat 1-1
    socket.emit("load_chat_messages", { user_id: myId, chatWith: data.seller_id });
  
    const handleReceiveMessage = (msg: Message) => {
      // Dùng msg chứ không phải item
      if (
        (msg.sender_id === myId && msg.receiver_id === data.seller_id) ||
        (msg.sender_id === data.seller_id && msg.receiver_id === myId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("connect");
    };
  }, [data.seller_id, myId]);
  

  // 2️⃣ Load tin nhắn khi thay đổi người nhận
  // useEffect(() => {
  //   const to = toUser.trim();
  //   if (!to) return;

  //   setMessages([]); // reset trước khi load
  //   console.log("🔄 Loading chat messages for:", to);
  //   socket.emit("load_chat_messages", { data.seller_id, chatWith: to });
  // }, [toUser, data?.seller_id]);

  // 3️⃣ Gửi tin nhắn
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!myId || !data.seller_id) return;
  
    socket.emit("send_message", {
      sender_id: myId,
      receiver_id: data.seller_id, // gửi cho seller
      text: message,
      image_url: null,
    });
  
    setMessage("");
  };
  

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === myId;
    const time = item.created_at
      ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
  
    return (
      <View style={[styles.msgContainer, isMine ? styles.myMsgContainer : styles.otherMsgContainer]}>
        {!isMine && <Text style={styles.sender}>{item.sender_id}</Text>}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
          {item.text ? <Text style={styles.text}>{item.text}</Text> : null}
          {item.image_url ? <Text style={styles.text}>[Ảnh]</Text> : null} 
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    );
  };
  
  
  console.log('toUser state:', toUser);
  console.log('data chat: ',data)
  const seller= data?.seller

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.point);
  const idPoint = data?.id;
  console.log(idPoint,'idPoint')
  const isOnwer = data?.buyer_id === data?.seller?.id;
  console.log('isOnwer',isOnwer)
  console.log('data?.buyer_id',data?.buyer_id)
  console.log('data?.seller?.id',data?.seller?.id)
  const handleConfirm = async () => {
 
    const resultAction = await dispatch(confirmPointAction(idPoint));
    console.log('resultAction',resultAction )
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
          <AppText fontSize={14}>{seller.full_name + ' - '+ seller.phone}</AppText>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText fontSize={14}>{'Điểm bán: '}</AppText>
          <AppText fontSize={14}>{data?.points_amount +' Điểm'}</AppText>
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
            style={{ paddingTop: 0 }}
          ></AppInput>
        </AppView>

        <AppButton onPress={sendMessage} >
          <AppText title="Send" />
        </AppButton>
      </AppView>

    </Container>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },

  msgContainer: {
    marginVertical: 6,
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
