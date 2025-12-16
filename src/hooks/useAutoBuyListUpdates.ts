// hooks/useAutoBuyListUpdates.ts
import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useAppDispatch } from "../redux/hooks/useAppDispatch";
import { fetchAutoBuyList } from "../redux/slices/requestAutoBuyTrip";
import { displayNotification } from "../utils/notificationService";

/**
 * Hook để nhận cập nhật danh sách auto buy từ server
 */
export const useAutoBuyListUpdates = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      console.log("⚠️ Auto Buy List Updates not ready:", { 
        socket: !!socket, 
        isConnected, 
        userId 
      });
      return;
    }

    console.log("📋 Setting up auto buy list updates listener for:", userId);

    const handleListUpdated = async (data: any) => {
      console.log("📋 AUTO BUY LIST UPDATED:", data);
      
      const { action, auto_request, reason } = data;

      // Refresh danh sách
      dispatch(fetchAutoBuyList());

      // Hiển thị notification tùy theo action
      if (action === 'deleted' && reason === 'purchased') {
        await displayNotification(
          "✅ Yêu cầu đã hoàn thành",
          "Đã tự động mua chuyến thành công",
          {
            screen: "ListPriorityPurchaseScreen",
          }
        );
      } else if (action === 'deleted' && reason === 'expired') {
        await displayNotification(
          "⏰ Yêu cầu hết hạn",
          "Không tìm thấy chuyến phù hợp",
          {
            screen: "ListPriorityPurchaseScreen",
          }
        );
      } else if (action === 'created') {
        await displayNotification(
          "📝 Yêu cầu mới",
          "Đã tạo yêu cầu mua chuyến tự động",
          {
            screen: "ListPriorityPurchaseScreen",
          }
        );
      }
    };

    socket.on("auto_buy_list_updated", handleListUpdated);

    return () => {
      console.log("🔕 Removing auto buy list updates listener");
      socket.off("auto_buy_list_updated", handleListUpdated);
    };
  }, [socket, isConnected, userId, dispatch]);
};