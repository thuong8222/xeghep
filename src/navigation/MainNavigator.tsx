import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import RootNavigator, { RootStackParamList } from './RootNavigator';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
export type RootParamList = {
  RootNavigator: NavigatorScreenParams<RootStackParamList>
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: { username: string };
};
import CustomSplash from '../screens/Splash';
import { useAppContext } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useSellerNotifications } from '../hooks/useSellerNotifications';
import { useBuyerNotifications } from '../hooks/useBuyerNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePointsListRealtime } from '../hooks/usePointsListRealtime';
import { useTransactionHistoryRealtime } from '../hooks/useTransactionHistoryRealtime';
import { useTripSellerNotifications } from '../hooks/useTripSellerNotifications';
import { useTripBuyerNotifications } from '../hooks/useTripBuyerNotifications';
import { useTripsListRealtime } from '../hooks/useTripsListRealtime';
import { useReceivedTripsRealtime } from '../hooks/useReceivedTripsRealtime';
import { useNotificationsRealtime } from '../hooks/useNotificationsRealtime';
import { useAllAutoBuyNotifications } from '../hooks/useAutoBuyNotifications';
import { useAutoBuyRealtimeUpdates } from '../hooks/useAutoBuyRealtimeUpdates';
import { useAutoBuyListUpdates } from '../hooks/useAutoBuyListUpdates';
const Stack = createNativeStackNavigator<RootParamList>();
export default function MainNavigator() {
  const { currentDriver } = useAppContext();
  const { socket, isConnected } = useSocket();
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      const driverString = await AsyncStorage.getItem("driver");
      if (driverString) {
        setDriver(JSON.parse(driverString));
      } else {
        setDriver(null); // ✅ reset khi logout
      }
    };
    fetchDriver();
  }, [currentDriver]); // ✅ chạy lại khi currentDriver thay đổi
  console.log('driver in MainNavigator: ', driver)
  console.log('currentDriver?.id || driver?.id: ', currentDriver?.id || driver?.id)
  useEffect(() => {
    if (!socket || !isConnected || !currentDriver?.id || !driver?.id) return;
    socket.emit("register_user", currentDriver.id || driver?.id);
  }, [socket, isConnected, currentDriver?.id, driver?.id]);



  // ✅ Listen cả 2 loại thông báo (vì user có thể vừa là buyer vừa là seller)
  useSellerNotifications(currentDriver?.id || driver?.id);
  useBuyerNotifications(currentDriver?.id || driver?.id);
  usePointsListRealtime();                          // Cập nhật danh sách điểm
  useTransactionHistoryRealtime(driver?.id || currentDriver?.id);
  // ✅ Kích hoạt tất cả hooks real-time
  useTripSellerNotifications(currentDriver?.id || driver?.id || undefined); // Nhận thông báo khi có người mua chuyến của mình
  useTripBuyerNotifications(currentDriver?.id || driver?.id || undefined);  // Nhận thông báo khi mua chuyến thành công
  useTripsListRealtime();                          // Auto update danh sách chuyến
  useReceivedTripsRealtime(currentDriver?.id || driver?.id || undefined);   // Auto update danh sách chuyến đã nhận
  // ✅ Kích hoạt notification system
  useNotificationsRealtime(currentDriver?.id || driver?.id);
  // ===== ✅ AUTO BUY TRIPS Notifications =====
  useAllAutoBuyNotifications(currentDriver?.id || driver?.id);          // Tất cả thông báo auto buy
  useAutoBuyRealtimeUpdates(currentDriver?.id || driver?.id);           // Cập nhật danh sách realtime
  useAutoBuyListUpdates(currentDriver?.id || driver?.id);
  return (
    <>
      {!isSplashDone ? (
        <CustomSplash onFinish={() => setIsSplashDone(true)} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {currentDriver?.id || driver?.id ? (
            <Stack.Screen name="RootNavigator" component={RootNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}

        </Stack.Navigator>
      )
      }
    </>
  );

}