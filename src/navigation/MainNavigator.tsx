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
const Stack = createNativeStackNavigator<RootParamList>();
export default function MainNavigator() {
  const { currentDriver } = useAppContext();
  const { socket, isConnected } = useSocket();
  const [isSplashDone, setIsSplashDone] = useState(false);

  const [driver, setDriver] = useState<any>(null);
  useEffect(() => {
    const fetchDriver = async () => {
      const driverString = await AsyncStorage.getItem("driver");
      if (driverString) setDriver(JSON.parse(driverString));
    };
    fetchDriver();
  }, []);
  // ✅ Đăng ký socket khi app khởi động
  useEffect(() => {
    if (!socket || !isConnected || !currentDriver?.id || !driver?.id) return;

    console.log("📌 Registering user on app mount:", currentDriver.id);
    socket.emit("register_user", currentDriver.id);
  }, [socket, isConnected, currentDriver?.id]);



  console.log('driver?.id AsyncStorage  in root navigator', driver?.id)

  console.log('currentDriver in root navigator', currentDriver.id)

  // ✅ Listen cả 2 loại thông báo (vì user có thể vừa là buyer vừa là seller)
  useSellerNotifications(currentDriver?.id || driver?.id);
  useBuyerNotifications(currentDriver?.id || driver?.id);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isSplashDone ? (
        <CustomSplash onFinish={() => setIsSplashDone(true)} />
      ) : (
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="RootNavigator" component={RootNavigator} />
        </Stack.Navigator>
   )}
    </GestureHandlerRootView>
  );
  
}