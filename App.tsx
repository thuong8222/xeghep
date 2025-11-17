/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootNavigator, { RootStackParamList } from './src/navigation/RootNavigator';
import AuthNavigator, { AuthStackParamList } from './src/navigation/AuthNavigator';

import { requestUserPermission, listenForForegroundMessages, registerBackgroundHandler, getFcmToken, createAndroidChannel, displayNotification } from '../xeghep/src/utils/notificationService';
import { Provider } from 'react-redux';
import { store } from './src/redux/data/store';
import CustomSplash from './src/screens/Splash';
import { ContextProvider } from './src/context/AppContext';
export type RootParamList = {
  RootNavigator: NavigatorScreenParams<RootStackParamList>
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: { username: string };
};

const Stack = createNativeStackNavigator<RootParamList>();

const App = () => {
  const [isSplashDone, setIsSplashDone] = useState(false);

  // Các hook khác cũng khai báo ở đây, không ở trong if
  useEffect(() => {
    console.log('App mounted');
  }, []);
  useEffect(() => {
    const initNotifications = async () => {
      console.log('App.tsx useEffect - initNotifications');

      // 1️⃣ Tạo channel Android
      await createAndroidChannel();

      // 2️⃣ Xin quyền notification
      await requestUserPermission();

      // 3️⃣ Test hiển thị local notification
      await displayNotification('Xin chào iOS', 'Test hiển thị local notification');

      // 4️⃣ Lắng nghe notification khi app đang foreground
      listenForForegroundMessages();
    };

    initNotifications();
  }, []);
  return (

    <Provider store={store}>
      <ContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {!isSplashDone ? (
            <CustomSplash onFinish={() => setIsSplashDone(true)} />
          ) : (
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="RootNavigator" component={RootNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          )}
        </GestureHandlerRootView>
      </ContextProvider>
    </Provider>

  );
};

export default App;

