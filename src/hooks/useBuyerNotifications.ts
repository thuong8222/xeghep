import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { displayNotification } from "../utils/notificationService";
import { navigate } from "../navigation/navigationRef";

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
    function handleNotificationNavigation(data: any, navigation: any) {
      const navData = data?.navData;
      if (!navData) return;
      const { screen, params } = navData;
      if (screen && navigation) {
        console.log(`🧭 Navigating to: ${screen}`, params);
        navigation.navigate(screen, params);
      }
    }
    
    const handleConfirmation = async (data: any) => {
      console.log("📩 POINT SALE CONFIRMED:", data);
      
      // Hiển thị Alert
      Alert.alert(
        "✅ Giao dịch thành công!",
        `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm`,
        [
          { 
            text: "Chi tiết", 
            onPress: () => handleNotificationNavigation({ navData: { screen: "AccountTabs", params: { screen: "HistoryBuySalePoint" } } }, navigation)
          },
          { text: "OK" }
        ]
      );
      

      // Hiển thị Push Notification
      await displayNotification(
        "Giao dịch thành công!",
        `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm cho bạn`,
        {
          "screen": "RootNavigator",
          "params": {
            "screen": "BottomTabs",
            "params": {
              "screen": "AccountTabs",
              "params": {
                "screen": "HistoryBuySalePoint"
              }
            }
          }
        }
        
        // navigate('RootNavigator', {
        //   screen: 'BottomTabs',
        //   params: {
        //     screen: 'AccountTabs',
        //     params: {
        //       screen: 'HistoryBuySalePoint',
             
        //     },
        //   },
        // });
        
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
