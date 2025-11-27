/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';

import React, { useEffect, useState } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";


import { requestUserPermission, listenForForegroundMessages,  createAndroidChannel, displayNotification } from '../xeghep/src/utils/notificationService';
import { Provider } from 'react-redux';
import { store } from './src/redux/data/store';

import { ContextProvider } from './src/context/AppContext';
import { SocketProvider } from './src/context/SocketContext';
import MainNavigator from './src/navigation/MainNavigator';


const App = () => {

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
      <SocketProvider>
        <ContextProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </ContextProvider>
      </SocketProvider>
    </Provider>

  );
};

export default App;

