/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';

import React, { useEffect, useState } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";


import { requestUserPermission, listenForForegroundMessages, createAndroidChannel, displayNotification, setupNotificationListeners } from '../xeghep/src/utils/notificationService';
import { Provider } from 'react-redux';
import { store } from './src/redux/data/store';

import { ContextProvider } from './src/context/AppContext';
import { SocketProvider } from './src/context/SocketContext';
import MainNavigator from './src/navigation/MainNavigator';
import { navigationRef } from './src/navigation/navigationRef';


const App = () => {

  useEffect(() => {
    const initNotifications = async () => {
      console.log('App.tsx useEffect - initNotifications');

      // 1️⃣ Tạo channel Android
      await createAndroidChannel();

      // 2️⃣ Xin quyền notification
      await requestUserPermission();

   

      // 4️⃣ Lắng nghe notification khi app đang foreground
      listenForForegroundMessages();
      // ⭐ Setup notification listeners với navigation
      if (navigationRef.current) {
        setupNotificationListeners(navigationRef.current);
      }
    };

    initNotifications();
  }, []);


  return (

    <Provider store={store}>
      <SocketProvider>
        <ContextProvider>
          <NavigationContainer ref={navigationRef}>
            <MainNavigator />
          </NavigationContainer>
        </ContextProvider>
      </SocketProvider>
    </Provider>

  );
};

export default App;

