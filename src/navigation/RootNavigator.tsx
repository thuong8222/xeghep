import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuBottomTabs, { BottomTabParamList } from './MenuBottomTabs';

import ChatScreen from '../screens/ChatScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    BottomTabs: NavigatorScreenParams<BottomTabParamList>;
    ChatScreen: { data: string };
   
  };
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='BottomTabs'>
    <Stack.Screen name="BottomTabs" component={MenuBottomTabs} />
 
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
   

  </Stack.Navigator>
  )
}