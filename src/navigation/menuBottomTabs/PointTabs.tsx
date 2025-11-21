import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PointScreen from '../../screens/Point/PointScreen';
import PointAddScreen from '../../screens/Point/PointAddScreen';
import ChatScreen from '../../screens/ChatScreen';

export type PointTabsParamList = {
  PointScreen: undefined;
  PointAddScreen: undefined;
  ChatScreen: { data: string };
}

const Stack = createNativeStackNavigator<PointTabsParamList>();
export default function PointTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Group screenOptions={{
        headerShown: true,
        // headerRight: HeaderRightButton,
      }}>
        <Stack.Screen name="PointScreen" component={PointScreen} options={{ headerTitle: 'Giao dịch điểm', headerTitleAlign: 'center' }} />
      </Stack.Group>
      <Stack.Screen
        name="PointAddScreen"
        component={PointAddScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'Bán điểm',
          presentation: 'modal',
        }}
      />
      {/* <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})