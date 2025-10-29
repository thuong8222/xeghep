import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReceivingScheduleScreen from '../../screens/ReceivingSchedule/ReceivingScheduleScreen';

export type ReceivingScheduleTabsParamList ={
  ReceivingScheduleScreen: undefined;

}
 const Stack = createNativeStackNavigator<ReceivingScheduleTabsParamList>();
export default function ReceivingScheduleTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
   
        <Stack.Screen name="ReceivingScheduleScreen" component={ReceivingScheduleScreen} />
           
      </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})