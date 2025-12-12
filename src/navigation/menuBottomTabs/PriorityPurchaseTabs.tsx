import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PriorityPurchaseScreen from '../../screens/priorityPurchase/PriorityPurchaseScreen';
import ListPriorityPurchaseScreen from '../../screens/priorityPurchase/ListPriorityPurchaseScreen';
import AutoBuyDetailScreen from '../../screens/priorityPurchase/AutoBuyDetailScreen';

export type ReceivingScheduleTabsParamList = {
  ListPriorityPurchaseScreen: undefined;
  PriorityPurchaseScreen: {
    id?: string,
    editData?: any
  };
  DetailTripHistory: { data: any };
  AutoBuyDetailScreen: { id: string }
}
const Stack = createNativeStackNavigator<ReceivingScheduleTabsParamList>();
export default function PriorityPurchaseTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>

      <Stack.Screen name="ListPriorityPurchaseScreen" component={ListPriorityPurchaseScreen} options={{
        headerTitle: 'Danh sách yêu cầu mua tự động',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="PriorityPurchaseScreen" component={PriorityPurchaseScreen} options={{
        headerTitle: 'Mua tự động',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="AutoBuyDetailScreen" component={AutoBuyDetailScreen} options={{
        headerTitle: 'Chi tiết yêu cầu',
        headerTitleAlign: 'center'
      }} />



    </Stack.Navigator>
  )

}

const styles = StyleSheet.create({})