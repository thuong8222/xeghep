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
    socket.emit("register_user", 'ten demo');
    // socket.emit("register_user", username);

    socket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    // Lắng nghe tin nhắn load 1-1
    const handleLoadMessages = (msgs: Message[]) => {
      console.log("📜 Loaded messages:", msgs);
      setMessages(msgs);
    };

    // Lắng nghe tin nhắn realtime
    const handleReceiveMessage = (msg: Message) => {
      if (
        (msg.user === data.seller_id && msg.to === toUser) ||
        (msg.user === toUser && msg.to === data.seller_id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("load_messages", handleLoadMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("load_messages", handleLoadMessages);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("connect");
    };
  }, [data.id, toUser]); // toUser cần để filter realtime messages

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
    const to = toUser.trim();
    if (!to) return Alert.alert("Info", "You must fill name receive user");
    if (!message.trim()) return;

    const msgData: Message = {
      user: data?.seller_id,
      text: message,
      to,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.user === data.seller_id;
    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], {
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
  console.log('toUser state:', toUser);
  const bankInfo = data?.bank_info ? JSON.parse(data.bank_info) : {
    bank_name: '',
    account_number: '',
    account_name: '',
  };
  const ListHeaderComponent =()=>{
    return(
      <AppView radius={16} padding={16} gap={6} backgroundColor={ColorsGlobal.backgroundGray}>
      <AppView row justifyContent={'space-between'}>
        <AppText fontSize={14}>{'Số tài khoản: '}</AppText>
        <AppText fontSize={14}>{bankInfo.account_number}</AppText>
      </AppView>
      <AppView row justifyContent={'space-between'}>
        <AppText fontSize={14}>{'Tên ngân hàng: '}</AppText>
        <AppText fontSize={14}>{bankInfo.bank_name}</AppText>
      </AppView>
      <AppView row justifyContent={'space-between'}>
        <AppText fontSize={14}>{'Chủ tài khoản: '}</AppText>
        <AppText fontSize={14}>{bankInfo.account_name}</AppText>
      </AppView>
    </AppView>
    )
  }
  return (
    <Container showTopInset >
      <TextInput
        placeholder="To (optional)"
        value={toUser}
        onChangeText={setToUser}
        style={styles.input}
      />
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
ListHeaderComponent={ListHeaderComponent}
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
