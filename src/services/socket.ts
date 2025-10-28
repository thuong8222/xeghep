import { io } from "socket.io-client";

// ⚠️ Đổi IP này thành IP máy Mac bạn (không dùng localhost khi test trên điện thoại thật)
const socket = io("http://192.168.120.75:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("🔴 Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚪️ Socket disconnected:", reason);
});
export default socket;
