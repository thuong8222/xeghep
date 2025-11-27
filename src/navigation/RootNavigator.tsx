import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuBottomTabs, { BottomTabParamList } from './MenuBottomTabs';

import ChatScreen from '../screens/ChatScreen';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { useSellerNotifications } from '../hooks/useSellerNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  ChatScreen: { data: any };

};
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  const navigation = useNavigation()

  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      const driverString = await AsyncStorage.getItem("driver");
      if (driverString) setDriver(JSON.parse(driverString));
    };
    fetchDriver();
  }, []);
  console.log('driver?.id AsyncStorage  in root navigator', driver?.id)
 const {currentDriver } = useAppContext();
 console.log('currentDriver in root navigator', currentDriver.id)

  // ✅ Hook notification tự handle driver?.id
  useSellerNotifications(currentDriver?.id || driver?.id);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='BottomTabs'>
      <Stack.Screen name="BottomTabs" component={MenuBottomTabs} />

      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
        headerShown: true,
        title: 'Chat',
      
      }} />
    </Stack.Navigator>
  )
}