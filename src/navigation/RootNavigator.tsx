import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuBottomTabs, { BottomTabParamList } from './MenuBottomTabs';

import ChatScreen from '../screens/ChatScreen';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { Button, HeaderBackButton } from '@react-navigation/elements';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { useSellerNotifications } from '../hooks/useSellerNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';
import { useBuyerNotifications } from '../hooks/useBuyerNotifications';

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  ChatScreen: { data: any };

};
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {

  const navigation = useNavigation()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='BottomTabs'>
      <Stack.Screen name="BottomTabs" component={MenuBottomTabs} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
        headerShown: true,
        title: 'Chat',
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),

      }} />
    </Stack.Navigator>
  )
}