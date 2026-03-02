import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { displayNotification } from '../utils/notificationService';

export const useTripSellerNotifications = (sellerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    if (!socket || !isConnected || !sellerId) {
      return;
    }

    const handleNotification = async (data: any) => {
      Alert.alert(
        '🚗 Chuyến đã được mua!',
        data.message || `${data.data.buyer.full_name} đã mua chuyến của bạn`,
        [{ text: 'OK' }],
      );

      await displayNotification(
        'Chuyến đã được mua!',
        data.message || 'Bạn có người mua chuyến mới',
        {
          screen: 'RootNavigator',
          params: {
            screen: 'BottomTabs',
            params: {
              screen: 'ReceivingScheduleTabs',
              params: {
                screen: 'ReceivingScheduleScreen',
              },
            },
          },
        },
      );
    };

    socket.on('new_trip_buyer_notification', handleNotification);

    return () => {
      socket.off('new_trip_buyer_notification', handleNotification);
    };
  }, [socket, isConnected, sellerId]);
};
