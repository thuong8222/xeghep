import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../../screens/accountScreen/AccountScreen';
import HistoryBuySalePoint from '../../screens/accountScreen/HistoryBuySalePoint';
import AccountInfoScreen from '../../screens/accountScreen/AccountInfoScreen';
import CarInfoScreen from '../../screens/accountScreen/CarInfoScreen';

export type AccountTabsParamList = {
  AccountScreen: undefined;
  HistoryBuySalePoint: undefined;
  AccountInfoScreen: undefined;
  CarInfoScreen: undefined;
}

const Stack = createNativeStackNavigator<AccountTabsParamList>();
export default function AccountTabs() {
  return (
    <Stack.Navigator screenOptions={{}}>

      <Stack.Screen name="AccountScreen" component={AccountScreen} options={{
        headerTitle: 'Tài khoản',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="HistoryBuySalePoint" component={HistoryBuySalePoint} options={{
        headerTitle: 'Lịch sử mua/bán điểm',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="AccountInfoScreen" component={AccountInfoScreen} options={{
        presentation: 'modal',
        headerTitle: 'Thông tin tài khoản',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="CarInfoScreen" component={CarInfoScreen} options={{
        presentation: 'modal',
        headerTitle: 'Thông tin xe',
        headerTitleAlign: 'center'
      }} />



    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})