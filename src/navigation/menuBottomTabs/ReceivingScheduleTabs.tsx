import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReceivingScheduleScreen from '../../screens/ReceivingSchedule/ReceivingScheduleScreen';
import DetailTripHistorySreen from '../../screens/ReceivingSchedule/DetailTripHistorySreen';

export type ReceivingScheduleTabsParamList = {
  ReceivingScheduleScreen: undefined;
  DetailTripHistory: { data: any };

}
const Stack = createNativeStackNavigator<ReceivingScheduleTabsParamList>();
export default function ReceivingScheduleTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>

      <Stack.Screen name="ReceivingScheduleScreen" component={ReceivingScheduleScreen} options={{
        headerTitle: 'Lịch sử chuyến',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="DetailTripHistory" component={DetailTripHistorySreen} options={{
        headerTitle: 'Chi tiết lịch nhận',
        headerTitleAlign: 'center'
      }} />

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})