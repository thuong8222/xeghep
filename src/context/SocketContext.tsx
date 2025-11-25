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
  const SOCKET_URL = "http://15.235.167.241:3000";
  
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
      socketRef.current = io(SOCKET_URL, {
        transports: ["polling", "websocket"], // ĐỔI THỨ TỰ: polling trước
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000,
        forceNew: true,
      });
    
      const socket = socketRef.current;
    
      socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
        console.log("🔌 Transport:", socket.io.engine.transport.name);
        setIsConnected(true);
      });
    
      socket.on("connect_error", (err) => {
        console.log("🔴 Socket connection error:", err.message);
        console.log("🔴 Trying transport:", socket.io.engine.transport.name);
      });
    
      socket.io.on("error", (error) => {
        console.log("❌ Socket.IO error:", error);
      });
    
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
        value={{ socket: socketRef.current, isConnected }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  