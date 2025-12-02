import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { displayNotification } from "../utils/notificationService";

export const useTripSellerNotifications = (sellerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();


  useEffect(() => {
    if (!socket || !isConnected || !sellerId) {
      console.log("⚠️ Trip seller notification hook not ready");
      return;
    }

    // console.log("🔔 Setting up trip seller notification listener for:", sellerId);

    const handleNotification = async (data: any) => {
      // console.log("📩 NEW TRIP BUYER NOTIFICATION:", data);
      
      Alert.alert(
        "🚗 Chuyến đã được mua!",
        data.message || `${data.data.buyer.full_name} đã mua chuyến của bạn`,
        [{ text: "OK" , }]
      );

      await displayNotification(
        'Chuyến đã được mua!',
        data.message || 'Bạn có người mua chuyến mới',
        {
          "screen": "RootNavigator",
          "params": {
            "screen": "BottomTabs",
            "params": {
              "screen": "ReceivingScheduleTabs",
              "params": {
                "screen": "ReceivingScheduleScreen"
              }
            }
          }
        }
      );
    };

    socket.on("new_trip_buyer_notification", handleNotification);

    return () => {
      console.log("🔕 Removing trip seller notification listener");
      socket.off("new_trip_buyer_notification", handleNotification);
    };
  }, [socket, isConnected, sellerId]);
};
