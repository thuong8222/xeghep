import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
  } from "react";
  import { io, Socket } from "socket.io-client";
  
  // ⚠️ IP server của bạn
  const SOCKET_URL = "http://192.168.120.75:3000";
  
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
  
    useEffect(() => {
      // Khởi tạo socket ONE-TIME
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
      });
  
      const socket = socketRef.current;
  
      socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
        setIsConnected(true);
      });
  
      socket.on("connect_error", (err) => {
        console.log("🔴 Socket connection error:", err.message);
      });
  
      socket.on("disconnect", (reason) => {
        console.log("⚪️ Socket disconnected:", reason);
        setIsConnected(false);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);
  
    return (
      <SocketContext.Provider
        value={{ socket: socketRef.current, isConnected }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  