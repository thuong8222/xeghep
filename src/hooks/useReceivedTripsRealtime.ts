import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/data/store";
import { addReceivedTrip } from "../redux/slices/tripsSlice";

export const useReceivedTripsRealtime = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      console.log("⚠️ Received trips realtime not ready");
      return;
    }

    console.log("🔔 Setting up received trips listener for:", userId);

    const handleReceivedTripsUpdate = (data: any) => {
      console.log("📨 Received trips updated:", data);
      /*
      DATA STRUCTURE:
      {
        trip: { id_trip: "...", ... }
      }
      */

      const { trip } = data;

      if (trip) {
        // Thêm chuyến vào danh sách "Chuyến đã nhận"
        dispatch(addReceivedTrip(trip));
        console.log("✅ Added trip to received list");
      }
    };

    socket.on("received_trips_updated", handleReceivedTripsUpdate);

    return () => {
      console.log("🔕 Removing received trips listener");
      socket.off("received_trips_updated", handleReceivedTripsUpdate);
    };
  }, [socket, isConnected, userId, dispatch]);
};