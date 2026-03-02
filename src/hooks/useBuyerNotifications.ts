import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { displayNotification } from '../utils/notificationService';
import { navigate } from '../navigation/navigationRef';

export const useBuyerNotifications = (buyerId?: string) => {
  const { socket, isConnected } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    if (!socket || !isConnected || !buyerId) {
      return;
    }

    function handleNotificationNavigation(data: any, navigation: any) {
      const navData = data?.navData;
      if (!navData) return;
      const { screen, params } = navData;
      if (screen && navigation) {
        navigation.navigate(screen, params);
      }
    }

    const handleConfirmation = async (data: any) => {
      // Hiển thị Alert
      Alert.alert(
        '✅ Giao dịch thành công!',
        `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm`,
        [
          {
            text: 'Chi tiết',
            onPress: () =>
              handleNotificationNavigation(
                {
                  navData: {
                    screen: 'AccountTabs',
                    params: { screen: 'HistoryBuySalePoint' },
                  },
                },
                navigation,
              ),
          },
          { text: 'OK' },
        ],
      );

      // Hiển thị Push Notification
      await displayNotification(
        'Giao dịch thành công!',
        `${data.seller.full_name} đã xác nhận bán ${data.points_amount} điểm cho bạn`,
        {
          screen: 'RootNavigator',
          params: {
            screen: 'BottomTabs',
            params: {
              screen: 'AccountTabs',
              params: {
                screen: 'HistoryBuySalePoint',
              },
            },
          },
        },

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
    socket.on('point_sale_confirmed', handleConfirmation);

    return () => {
      socket.off('point_sale_confirmed', handleConfirmation);
    };
  }, [socket, isConnected, buyerId, navigation]);
};
