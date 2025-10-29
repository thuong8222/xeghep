import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuBottomTabs from './MenuBottomTabs';

import ChatScreen from '../screens/ChatScreen';

export type RootStackParamList = {
    BottomTabs: undefined;
  
    ChatScreen: { username: string };
   
  };
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BottomTabs" component={MenuBottomTabs} />
 
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
   

  </Stack.Navigator>
  )
}