import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuBottomTabs, { BottomTabParamList } from './MenuBottomTabs';

import ChatScreen from '../screens/ChatScreen';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

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
        title: 'Chat', // headerTitle cũng được, nhưng title là cách phổ biến
        headerLeft: () => (
          <Button title="Back" onPress={() => navigation.goBack()} />
        ),
      }} />
    </Stack.Navigator>
  )
}