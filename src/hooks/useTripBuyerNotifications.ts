import { useEffect } from 'react';
import { Alert } from 'react-native';
import { displayNotification } from '../utils/notificationService';
import { useSocket } from '../context/SocketContext';

export const useTripBuyerNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      return;
    }

    const handleConfirmation = async (data: any) => {
      Alert.alert(
        '✅ Mua chuyến thành công!',
        data.message || `Bạn đã mua chuyến từ ${data.trip.seller.full_name}`,
        [{ text: 'OK' }],
      );

      await displayNotification(
        'Mua chuyến thành công!',
        data.message || 'Giao dịch đã hoàn tất',
      );
    };

    socket.on('trip_purchase_confirmed', handleConfirmation);

    return () => {
      socket.off('trip_purchase_confirmed', handleConfirmation);
    };
  }, [socket, isConnected, buyerId]);
};
