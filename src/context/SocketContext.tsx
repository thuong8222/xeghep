import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import AppConfig from "../services/config";
import { useAppContext } from "./AppContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { currentDriver } = useAppContext();

  useEffect(() => {
    const newSocket = io(AppConfig.SOCKET_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    setSocket(newSocket);

    const registerUser = async () => {
      try {
        const driverString = await AsyncStorage.getItem("driver");
        if (!driverString) return;

        const driver = JSON.parse(driverString);
        if (!driver?.id) return;

        console.log("📌 Register user:", driver.id);
        newSocket.emit("register_user", driver.id);
      } catch (error) {
        console.log("❌ Register error:", error);
      }
    };

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      setIsConnected(true);
      registerUser();
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.log("❌ Connect error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const id = (currentDriver as any)?.id;
    if (!isConnected) {
      try {
        socket.connect();
      } catch { }
    }
    if (id && socket.connected) {
      socket.emit("register_user", id);
    }
  }, [socket, isConnected, (currentDriver as any)?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
