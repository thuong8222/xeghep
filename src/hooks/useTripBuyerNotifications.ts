import { useEffect } from "react";
import { Alert } from "react-native";
import { displayNotification } from "../utils/notificationService";
import { useSocket } from "../context/SocketContext";

export const useTripBuyerNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Trip buyer notification hook not ready");
      return;
    }

    console.log("🔔 Setting up trip buyer notification listener for:", buyerId);

    const handleConfirmation = async (data: any) => {
      console.log("📩 TRIP PURCHASE CONFIRMED:", data);

      Alert.alert(
        "✅ Mua chuyến thành công!",
        data.message || `Bạn đã mua chuyến từ ${data.trip.seller.full_name}`,
        [{ text: "OK" }]
      );

      await displayNotification(
        "Mua chuyến thành công!",
        data.message || "Giao dịch đã hoàn tất"
      );
    };

    socket.on("trip_purchase_confirmed", handleConfirmation);

    return () => {
      console.log("🔕 Removing trip buyer notification listener");
      socket.off("trip_purchase_confirmed", handleConfirmation);
    };
  }, [socket, isConnected, buyerId]);
};
