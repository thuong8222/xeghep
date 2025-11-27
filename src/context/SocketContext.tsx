import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../redux/data/store";

// ⚠️ IP server của bạn



// Type cho Context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;

}

// Tạo Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Hook dùng nhanh trong màn hình
export const useSocket = () => useContext(SocketContext);

// Provider bọc App
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  ;
  const SOCKET_URL = "http://15.235.167.241:4000"
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      // transports: ["polling", "websocket"],
      transports: ["websocket", "polling"], // thử websocket trực tiếp, polling nếu cần
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
      forceNew: true,
    });

    const socket = socketRef.current;

    const registerUser = async () => {
      try {
        const driverString = await AsyncStorage.getItem("driver");
        if (!driverString) return;

        const driver_ = JSON.parse(driverString);
        if (!driver_?.id) return;

        console.log('first driver id in socket context', driver_.id)

        socket.emit("register_user socket context", driver_.id);
        console.log("📌 Register user online socket context:", driver_.id);
      } catch (error) {
        console.log("❌ Error register user socket context:", error);
      }
    };

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      console.log("🔌 Transport:", socket.io.engine.transport.name);
      setIsConnected(true);

      // Emit user ngay khi socket connect
      registerUser();
    });

    socket.on("connect_error", (err) => {
      console.log("🔴 Socket connection error:", err.message);
      console.log("🔴 Trying transport:", socket.io.engine.transport.name);
    });

    socket.io.on("error", (error) => { 
      console.log("❌ Socket.IO error:", error);
    });
    // Demo: nhận message từ server
    // socket.on("message", (msg) => {
    //   console.log("Server gửi:", msg);
    // });

    socket.on("disconnect", (reason) => {
      console.log("⚪️ Socket disconnected:", reason);
      setIsConnected(false);

      if (reason === "io server disconnect") {
        // Server chủ động ngắt, cần reconnect thủ công
        socket.connect();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current, isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
