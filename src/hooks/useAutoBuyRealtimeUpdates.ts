// ========================================
// hooks/useAutoBuyRealtimeUpdates.ts
// ========================================

import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAppDispatch } from '../redux/hooks/useAppDispatch';
import {
  updateAutoBuyItem,
  addAutoBuyItem,
  fetchAutoBuyList,
} from '../redux/slices/requestAutoBuyTrip';

/**
 * Hook để tự động cập nhật danh sách auto buy requests
 * khi có sự kiện từ server
 */
export const useAutoBuyRealtimeUpdates = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      console.log('⚠️ Auto Buy Realtime not ready:', {
        socket: !!socket,
        isConnected,
        userId,
      });
      return;
    }

    console.log('🔄 Setting up auto buy realtime updates for:', userId);
    // ✅ Listen event từ server
    const handleListUpdated = (data: any) => {
      console.log('🔄 AUTO BUY LIST UPDATED:', data);

      const { action, auto_request } = data;

      // Refresh list
      dispatch(fetchAutoBuyList());
    };
    socket.on('auto_buy_list_updated', handleListUpdated);
    // // ✅ 1. Khi mua thành công - Update status thành 1
    // const handleAutoBuySuccess = (data: any) => {
    //   console.log("🔄 Updating auto buy request to completed:", data);

    //   const { auto_request, trip } = data;

    //   if (auto_request) {
    //     // Update item trong Redux
    //     dispatch(updateAutoBuyItem({
    //       id: auto_request.id,
    //       status: 1,
    //       trip_id: trip?.id,
    //       trip: trip,
    //       seller_driver_id: trip?.id_driver_sell,
    //       time_bought: new Date().toISOString(),
    //     }));
    //   } else {
    //     // Hoặc fetch lại toàn bộ list
    //     dispatch(fetchAutoBuyList());
    //   }
    // };

    // // ✅ 2. Khi tạo mới yêu cầu - Thêm vào list
    // const handleAutoBuyCreated = (data: any) => {
    //   console.log("🔄 Adding new auto buy request:", data);

    //   const { auto_request } = data;

    //   if (auto_request) {
    //     dispatch(addAutoBuyItem(auto_request));
    //   }
    // };

    // // ✅ 3. Khi cập nhật yêu cầu
    // const handleAutoBuyUpdated = (data: any) => {
    //   console.log("🔄 Auto buy request updated:", data);

    //   const { auto_request } = data;

    //   if (auto_request) {
    //     dispatch(updateAutoBuyItem(auto_request));
    //   }
    // };

    // // ✅ 4. Khi hủy yêu cầu - Update status thành 2
    // const handleAutoBuyCancelled = (data: any) => {
    //   console.log("🔄 Auto buy request cancelled:", data);

    //   const { auto_request_id } = data;

    //   if (auto_request_id) {
    //     dispatch(updateAutoBuyItem({
    //       id: auto_request_id,
    //       status: 2, // Đã hủy
    //     }));
    //   }
    // };

    // // ✅ 5. Khi mua thất bại - Không cần update gì (giữ nguyên status 0)
    // const handleAutoBuyFailed = (data: any) => {
    //   console.log("⚠️ Auto buy failed:", data);
    //   // Không update gì, yêu cầu vẫn ở status 0
    // };

    // Register event listeners
    // socket.on("auto_buy_success", handleAutoBuySuccess);
    // socket.on("auto_buy_created", handleAutoBuyCreated);
    // socket.on("auto_buy_updated", handleAutoBuyUpdated);
    // socket.on("auto_buy_cancelled", handleAutoBuyCancelled);
    // socket.on("auto_buy_failed", handleAutoBuyFailed);

    return () => {
      console.log('🔕 Removing auto buy realtime listeners');
      // socket.off("auto_buy_success", handleAutoBuySuccess);
      // socket.off("auto_buy_created", handleAutoBuyCreated);
      // socket.off("auto_buy_updated", handleAutoBuyUpdated);
      // socket.off("auto_buy_cancelled", handleAutoBuyCancelled);
      // socket.off("auto_buy_failed", handleAutoBuyFailed);
      socket.off('auto_buy_list_updated', handleListUpdated);
    };
  }, [socket, isConnected, userId, dispatch]);
};
