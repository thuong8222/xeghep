import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PointScreen from '../../screens/Point/PointScreen';

export type PointTabsParamList = {
  PointScreen: undefined;

}

const Stack = createNativeStackNavigator<PointTabsParamList>();
export default function PointTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>

      <Stack.Screen name="PointScreen" component={PointScreen} options={{ headerTitle: 'Giao dịch điểm', headerTitleAlign: 'center' }} />

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})