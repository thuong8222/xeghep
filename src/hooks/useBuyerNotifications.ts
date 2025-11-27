import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { displayNotification } from "../utils/notificationService";

export const useBuyerNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();
console.log('useBuyerNotifications:', buyerId);
  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Buyer notification hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("🔔 Setting up notification listener for buyer:", buyerId);

    const handleConfirmation = async (data: any) => {
      console.log("📩 POINT SALE CONFIRMED:", data);
      
      // Hiển thị Alert
      Alert.alert(
        "✅ Giao dịch thành công!",
        data.message || `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm`,
        [
          { 
            text: "Xem chi tiết", 
            onPress: () => {
              // Navigate đến màn hình lịch sử hoặc chi tiết giao dịch
              navigation.navigate("TransactionHistory");
            }
          },
          { text: "OK" }
        ]
      );

      // Hiển thị Push Notification
      await displayNotification(
        'Giao dịch thành công!', 
        `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm cho bạn`
      );
    };

    // ✅ Listen event từ server
    socket.on("point_sale_confirmed", handleConfirmation);

    return () => {
      console.log("🔕 Removing buyer notification listener");
      socket.off("point_sale_confirmed", handleConfirmation);
    };
  }, [socket, isConnected, buyerId, navigation]);
};
