import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/data/store";
import { 
  addTrip, 
  updateTrip, 
  removeTrip 
} from "../redux/slices/tripsSlice";

export const useTripsListRealtime = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
console.log('useTripsListRealtime initialized');
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⚠️ Trips list realtime not ready");
      return;
    }

    console.log("🔔 Setting up trips list real-time listener");

    const handleTripsUpdate = (data: any) => {
      console.log("🚗 Trips list updated:", data);
      /*
      DATA STRUCTURE:
      {
        action: "created" | "sold" | "updated" | "deleted",
        trip: { id_trip: "...", ... }
      }
      */

      const { action, trip } = data;

      switch (action) {
        case 'created':
          // Có người tạo chuyến mới → Thêm vào danh sách
          dispatch(addTrip(trip));
          console.log("✅ Added new trip to list");
          break;

        case 'sold':
          // Chuyến đã được mua → Xóa khỏi danh sách available
          dispatch(removeTrip(trip.id_trip));
          console.log("✅ Removed sold trip from list");
          break;

        case 'updated':
          // Thông tin chuyến thay đổi → Cập nhật
          dispatch(updateTrip(trip));
          console.log("✅ Updated trip info");
          break;

        case 'deleted':
          // Chuyến bị xóa → Xóa khỏi danh sách
          dispatch(removeTrip(trip.id_trip));
          console.log("✅ Removed deleted trip");
          break;

        default:
          console.log("⚠️ Unknown action:", action);
      }
    };

    // Đăng ký listener
    socket.on("trips_list_updated", handleTripsUpdate);

    return () => {
      console.log("🔕 Removing trips list listener");
      socket.off("trips_list_updated", handleTripsUpdate);
    };
  }, [socket, isConnected, dispatch]);
};