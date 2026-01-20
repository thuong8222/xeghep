import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../../screens/accountScreen/AccountScreen';
import HistoryBuySalePoint from '../../screens/accountScreen/HistoryBuySalePoint';
import AccountInfoScreen from '../../screens/accountScreen/AccountInfoScreen';
import CarInfoScreen from '../../screens/accountScreen/CarInfoScreen';
import { Driver } from '../../redux/slices/driverSlice';

import NotificationScreen from '../../screens/accountScreen/NotificationScreen';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import DetailNotification from '../../screens/accountScreen/DetailNotificationScreen';
import DetailNotificationScreen from '../../screens/accountScreen/DetailNotificationScreen';
import BankStatementBuySalePoint from '../../screens/accountScreen/BankStatementBuySalePoint';

export type AccountTabsParamList = {
  AccountScreen: undefined;
  HistoryBuySalePoint: undefined;
  BankStatementBuySalePoint:undefined;
  AccountInfoScreen: {data:Driver};
  CarInfoScreen: {data:Driver};
  Notification: undefined;
  DetailNotification: {data:any}
}

const Stack = createNativeStackNavigator<AccountTabsParamList>();
export default function AccountTabs() {
  const navigation =useNavigation()
  return (
    <Stack.Navigator screenOptions={{}}>

      <Stack.Screen name="AccountScreen" component={AccountScreen} options={{
        headerTitle: 'Tài khoản',
        headerTitleAlign: 'center'
      }} />
      <Stack.Screen name="HistoryBuySalePoint" component={HistoryBuySalePoint} options={{
        headerTitle: 'Lịch sử mua/bán điểm',
        headerTitleAlign: 'center',
    
      }} />
       <Stack.Screen name="BankStatementBuySalePoint" component={BankStatementBuySalePoint} options={{
        headerTitle: 'Sao kê lịch sử điểm',
        headerTitleAlign: 'center',
    
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
        <Stack.Screen name="Notification" component={NotificationScreen} options={{
        presentation: 'modal',
        headerTitle: 'Thông báo',
        headerTitleAlign: 'center'
      }} />
       <Stack.Screen name="DetailNotification" component={DetailNotificationScreen} options={{
        presentation: 'modal',
        headerTitle: 'Chi tiết thông báo',
        headerTitleAlign: 'center'
      }} />

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})