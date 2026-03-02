import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Alert } from 'react-native'; // hoặc dùng toast library
import { useNavigation } from '@react-navigation/native';
import { displayNotification } from '../utils/notificationService';

export const useSellerNotifications = (sellerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();
  useEffect(() => {
    if (!socket || !isConnected || !sellerId) {
      return;
    }

    const handleNotification = async (data: any) => {
      // Hiển thị thông báo
      Alert.alert(
        '🛒 Người mua mới!',
        data.message || `${data.buyer_id} muốn mua điểm`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('RootNavigator', {
                screen: 'ChatScreen',
                params: { data: data.data },
              });
            },
          },
        ],
      );
      // 🚀 Push notification – click để vào ChatScreen
      await displayNotification(
        'Người mua mới!',
        data.message || 'Bạn có người mua mới muốn liên hệ',
        {
          screen: 'ChatScreen',
          params: { data: data.data },
        },
      );

      // TODO: Cập nhật state, navigate, hoặc show toast
    };

    // ✅ ĐÚNG: Listen event "new_buyer_notification" (match với server)
    socket.on('new_buyer_notification', handleNotification);

    return () => {
      socket.off('new_buyer_notification', handleNotification);
    };
  }, [socket, isConnected, sellerId]);
};
