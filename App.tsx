/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootNavigator, { RootStackParamList } from './src/navigation/RootNavigator';
import AuthNavigator, { AuthStackParamList } from './src/navigation/AuthNavigator';

import { requestUserPermission, listenForForegroundMessages, registerBackgroundHandler, getFcmToken, createAndroidChannel } from '../xeghep/src/utils/notificationService';
export type RootParamList = {
  RootNavigator: NavigatorScreenParams<RootStackParamList>
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: { username: string };
};

const Stack = createNativeStackNavigator<RootParamList>();

const App = () => {

  useEffect(() => {
    console.log('App.tsx useEffect ')
    createAndroidChannel();   // tạo channel Android
    requestUserPermission();  // xin quyền notification
    listenForForegroundMessages(); // lắng nghe foreground
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="RootNavigator" component={RootNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

