import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import socket from "../services/socket";
import { Message } from "../types/Message";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Chat: { username: string };
};

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

interface Props {
  route: ChatRouteProp;
}

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { username } = route.params;
  console.log('first username:', username);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log('uef')
    if (socket.connected) {
      console.log("✅ Already connected to server chatscreen");
      socket.emit("load_all_messages");
    }
    socket.on("connect", () => {
      console.log("✅ Connected to server chatscreen");
      // Yêu cầu tải lại toàn bộ tin nhắn khi vừa kết nối
      socket.emit("load_all_messages");
    });
    socket.on("load_messages", (msgs: Message[]) => {
      console.log("📜 Loaded messages:", msgs);
      setMessages(msgs);
    });
    socket.on("receive_message", (data: Message) => {
      console.log("💬 Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("load_messages");
    };
  }, []);

  const sendMessage = () => {
    console.log('sendMessage called with message:', message);
    if (!message.trim()) return;
    const msgData: Message = { user: username, text: message };
    console.log('first msgData:', msgData);
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
  return (
    <View style={styles.container}>
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
