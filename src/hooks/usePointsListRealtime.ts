import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/data/store";
import { 
  addPoint, 
  updatePoint, 
  removePoint 
} from '../redux/slices/pointSlice'; // ✅ Import từ pointSlice

export const usePointsListRealtime = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⚠️ Points list realtime not ready");
      return;
    }

    console.log("🔔 Setting up points list real-time listener");
    console.log("📡 Socket ID:", socket.id);
    console.log("📡 Socket connected:", socket.connected);
    const handlePointsUpdate = (data: any) => {
      console.log("📋 Points list updated:", data);
      console.log("📋 Action:", data.action);
      console.log("📋 Point:", data.point);
      const { action, point } = data;

      switch (action) {
        case 'created':
            console.log("➕ Adding new point:", point.id);
          // Thêm điểm mới vào danh sách
          dispatch(addPoint(point));
          console.log("✅ Added new point to list");
          break;

        case 'bought':
          // Cập nhật status thành 'pending_payment'
          console.log("🔄 Updating point:", point.id);
          dispatch(updatePoint(point));
          console.log("✅ Updated point status to pending");
          break;

        case 'confirmed':
          // Xóa khỏi danh sách (vì đã completed)
          dispatch(removePoint(point.id));
          console.log("✅ Removed completed point from list");
          break;

        default:
          console.log("⚠️ Unknown action:", action);
      }
    };

    socket.on("points_list_updated", handlePointsUpdate);
    console.log("✅ Registered 'points_list_updated' listener");

    // ✅ Test xem socket có nhận events không
    socket.onAny((eventName, ...args) => {
      console.log(`📥 Received any event: ${eventName}`, args);
    });
    return () => {
      console.log("🔕 Removing points list listener");
      socket.off("points_list_updated", handlePointsUpdate);
    };
  }, [socket, isConnected, dispatch]);
};