import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string | null;
  text?: string | null;
  image_url?: string | null;
  created_at: string;
}

interface SocketContextType {
  socket: Socket | null;
  messages: Message[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  messages: [],
});

interface SocketProviderProps {
  children: ReactNode;
  driverId: string;
  serverUrl: string; // ví dụ "http://192.168.1.100:3000"
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, driverId, serverUrl }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const s = io(serverUrl, {
      transports: ["websocket"],
      timeout: 10000,
    });

    s.on("connect", () => {
      console.log("✅ Connected to Socket.io server");
      s.emit("register_driver", driverId);
    });

    s.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("load_messages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [driverId, serverUrl]);

  return (
    <SocketContext.Provider value={{ socket, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook tiện lợi
export const useSocket = () => useContext(SocketContext);
