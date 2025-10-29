import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";
import socket from "../services/socket";
import { Message } from "../types/Message";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Chat: { username: string };
};

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

interface Props {
  route: ChatRouteProp;
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toUser, setToUser] = useState("user2");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${username}`,
    });
  }, [navigation, username]);

  // 1️⃣ Register user & setup listeners
  useEffect(() => {
    socket.emit("register_user", username);

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
        (msg.user === username && msg.to === toUser) ||
        (msg.user === toUser && msg.to === username)
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
  }, [username, toUser]); // toUser cần để filter realtime messages

  // 2️⃣ Load tin nhắn khi thay đổi người nhận
  useEffect(() => {
    const to = toUser.trim();
    if (!to) return;

    setMessages([]); // reset trước khi load
    console.log("🔄 Loading chat messages for:", to);
    socket.emit("load_chat_messages", { username, chatWith: to });
  }, [toUser, username]);

  // 3️⃣ Gửi tin nhắn
  const sendMessage = () => {
    const to = toUser.trim();
    if (!to) return Alert.alert("Info", "You must fill name receive user");
    if (!message.trim()) return;

    const msgData: Message = {
      user: username,
      text: message,
      to,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };
 
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.user === username;
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
  return (
    <View style={styles.container}>
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
     
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
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

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: "#fff",
  },
});
