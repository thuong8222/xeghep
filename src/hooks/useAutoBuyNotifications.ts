// ========================================
// hooks/useAutoBuyNotifications.ts
// ========================================

import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { displayNotification } from "../utils/notificationService";
import { useAppDispatch } from "../redux/hooks/useAppDispatch";
import { fetchAutoBuyList } from "../redux/slices/requestAutoBuyTrip";

/**
 * Hook để nhận thông báo khi mua chuyến tự động THÀNH CÔNG
 * Dành cho BUYER (người tạo yêu cầu auto buy)
 */
export const useAutoBuySuccessNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Auto Buy Success hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("🤖 Setting up auto buy success listener for:", buyerId);

    const handleAutoBuySuccess = async (data: any) => {
      console.log("🎉 AUTO BUY SUCCESS:", data);
      
      const { trip, message, notification } = data;

      // Hiển thị Alert
      Alert.alert(
        "🎉 Mua chuyến tự động thành công!",
        `${trip.place_start} → ${trip.place_end}\n${trip.points} điểm - ${trip.price_sell}K`,
        [
          {
            text: "Xem chi tiết",
            onPress: () => {
              navigation.navigate("RootNavigator", {
                screen: "TripDetailScreen",
                params: { tripId: trip.id, isReceived: true },
              });
            }
          },
          { text: "OK" }
        ]
      );

      // Push notification
      await displayNotification(
        notification?.title || "Mua chuyến tự động thành công",
        notification?.body || message,
        {
          screen: "TripDetailScreen",
          params: { tripId: trip.id, isReceived: true },
        }
      );

      // Refresh danh sách yêu cầu auto buy
      dispatch(fetchAutoBuyList());

      // TODO: Refresh danh sách chuyến đã nhận
      // dispatch(fetchReceivedTrips());
    };

    socket.on("auto_buy_success", handleAutoBuySuccess);

    return () => {
      console.log("🔕 Removing auto buy success listener");
      socket.off("auto_buy_success", handleAutoBuySuccess);
    };
  }, [socket, isConnected, buyerId, navigation, dispatch]);
};

/**
 * Hook để nhận thông báo khi chuyến được MUA TỰ ĐỘNG
 * Dành cho SELLER (người đăng chuyến)
 */
export const useAutoBuySoldNotifications = (sellerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    if (!socket || !isConnected || !sellerId) {
      console.log("⚠️ Auto Buy Sold hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        sellerId 
      });
      return;
    }

    console.log("💰 Setting up trip sold auto listener for:", sellerId);

    const handleTripSoldAuto = async (data: any) => {
      console.log("💰 TRIP SOLD AUTO:", data);
      
      const { trip, message, notification } = data;

      // Hiển thị Alert
      Alert.alert(
        "💰 Chuyến đã được mua tự động!",
        `${trip.buyer?.full_name || 'Khách hàng'} mua:\n${trip.place_start} → ${trip.place_end}\n${trip.point} điểm - ${trip.price_sell}K`,
        [
          {
            text: "Xem chi tiết",
            onPress: () => {
              navigation.navigate("RootNavigator", {
                screen: "TripDetailScreen",
                params: { tripId: trip.id, isSold: true },
              });
            }
          },
          { text: "OK" }
        ]
      );

      // Push notification
      await displayNotification(
        notification?.title || "Chuyến đã được mua tự động",
        notification?.body || message,
        {
          screen: "TripDetailScreen",
          params: { tripId: trip.id, isSold: true },
        }
      );

      // TODO: Refresh danh sách chuyến đã bán
      // dispatch(fetchSoldTrips());
    };

    socket.on("trip_sold_auto", handleTripSoldAuto);

    return () => {
      console.log("🔕 Removing trip sold auto listener");
      socket.off("trip_sold_auto", handleTripSoldAuto);
    };
  }, [socket, isConnected, sellerId, navigation]);
};

/**
 * Hook để nhận thông báo khi TÌM THẤY CHUYẾN PHÙ HỢP
 * Dành cho BUYER (người tạo yêu cầu auto buy)
 */
export const useAutoBuyMatchFoundNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Match Found hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("🔍 Setting up match found listener for:", buyerId);

    const handleMatchFound = async (data: any) => {
      console.log("🔍 MATCH FOUND:", data);
      
      const { trip, message, notification } = data;

      // Hiển thị Alert
      Alert.alert(
        "🔍 Tìm thấy chuyến phù hợp!",
        `${trip.place_start} → ${trip.place_end}\n${trip.points} điểm - ${trip.price_sell}K`,
        [
          {
            text: "Xem ngay",
            onPress: () => {
              navigation.navigate("RootNavigator", {
                screen: "TripDetailScreen",
                params: { tripId: trip.id },
              });
            }
          },
          { text: "Để sau" }
        ]
      );

      // Push notification
      await displayNotification(
        notification?.title || "Tìm thấy chuyến phù hợp",
        notification?.body || message,
        {
          screen: "TripDetailScreen",
          params: { tripId: trip.id },
        }
      );
    };

    socket.on("auto_buy_match_found", handleMatchFound);

    return () => {
      console.log("🔕 Removing match found listener");
      socket.off("auto_buy_match_found", handleMatchFound);
    };
  }, [socket, isConnected, buyerId, navigation]);
};

/**
 * Hook để nhận thông báo khi TẠO YÊU CẦU AUTO BUY THÀNH CÔNG
 * Dành cho BUYER
 */
export const useAutoBuyCreatedNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Auto Buy Created hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("📝 Setting up auto buy created listener for:", buyerId);

    const handleAutoBuyCreated = async (data: any) => {
      console.log("📝 AUTO BUY CREATED:", data);
      
      const { auto_request, message, notification } = data;

      // Hiển thị thông báo nhẹ (không cần Alert vì đã có trong screen)
      await displayNotification(
        notification?.title || "Yêu cầu mua tự động",
        notification?.body || message,
        {
          screen: "ListPriorityPurchaseScreen",
        }
      );

      // Refresh danh sách
      dispatch(fetchAutoBuyList());
    };

    socket.on("auto_buy_created", handleAutoBuyCreated);

    return () => {
      console.log("🔕 Removing auto buy created listener");
      socket.off("auto_buy_created", handleAutoBuyCreated);
    };
  }, [socket, isConnected, buyerId, dispatch]);
};

/**
 * Hook để nhận thông báo khi MUA TỰ ĐỘNG THẤT BẠI
 * Dành cho BUYER
 */
export const useAutoBuyFailedNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Auto Buy Failed hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("❌ Setting up auto buy failed listener for:", buyerId);

    const handleAutoBuyFailed = async (data: any) => {
      console.log("❌ AUTO BUY FAILED:", data);
      
      const { reason, message, notification } = data;

      // Hiển thị Alert
      Alert.alert(
        "❌ Mua tự động thất bại",
        reason || message || "Không thể mua chuyến này",
        [{ text: "OK" }]
      );

      // Push notification
      await displayNotification(
        notification?.title || "Mua tự động thất bại",
        notification?.body || reason || message,
        {}
      );

      // Refresh danh sách
      dispatch(fetchAutoBuyList());
    };

    socket.on("auto_buy_failed", handleAutoBuyFailed);

    return () => {
      console.log("🔕 Removing auto buy failed listener");
      socket.off("auto_buy_failed", handleAutoBuyFailed);
    };
  }, [socket, isConnected, buyerId, dispatch]);
};
/**
 * Hook để nhận thông báo khi yêu cầu HẾT HẠN
 * Dành cho BUYER
 */
export const useAutoBuyExpiredNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      console.log("⚠️ Auto Buy Expired hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        buyerId 
      });
      return;
    }

    console.log("⏰ Setting up auto buy expired listener for:", buyerId);

    const handleAutoBuyExpired = async (data: any) => {
      console.log("⏰ AUTO BUY EXPIRED:", data);
      
      const { auto_request, message, notification } = data;

      // Hiển thị Alert
      Alert.alert(
        "⏰ Yêu cầu hết hạn",
        message || "Không tìm thấy chuyến phù hợp trong khoảng thời gian yêu cầu",
        [{ text: "OK" }]
      );

      // Push notification
      await displayNotification(
        notification?.title || "Yêu cầu hết hạn",
        notification?.body || message,
        {
          screen: "ListPriorityPurchaseScreen",
        }
      );

      // Refresh danh sách
      dispatch(fetchAutoBuyList());
    };

    socket.on("auto_buy_expired", handleAutoBuyExpired);

    return () => {
      console.log("🔕 Removing auto buy expired listener");
      socket.off("auto_buy_expired", handleAutoBuyExpired);
    };
  }, [socket, isConnected, buyerId, dispatch]);
};

/**
 * Hook TỔNG HỢP - Kích hoạt TẤT CẢ auto buy notifications
 * Sử dụng hook này trong MainNavigator
 */
export const useAllAutoBuyNotifications = (userId?: string) => {
  useAutoBuySuccessNotifications(userId);
  useAutoBuySoldNotifications(userId);
  useAutoBuyMatchFoundNotifications(userId);
  useAutoBuyCreatedNotifications(userId);
  useAutoBuyFailedNotifications(userId);
  useAutoBuyExpiredNotifications(userId); 
};