import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../../screens/accountScreen/AccountScreen';
import HistoryBuySalePoint from '../../screens/accountScreen/HistoryBuySalePoint';

export type AccountTabsParamList ={
    AccountScreen: undefined;
    HistoryBuySalePoint:undefined;
}

 const Stack = createNativeStackNavigator<AccountTabsParamList>();
export default function AccountTabs() {
  return (
    <Stack.Navigator screenOptions={{  }}>
  
       <Stack.Screen name="AccountScreen" component={AccountScreen} options={{headerTitle:'Tài khoản', 
        headerTitleAlign:'center'
       }} />
         <Stack.Screen name="HistoryBuySalePoint" component={HistoryBuySalePoint} options={{headerTitle:'Lịch sử mua/bán điểm', 
        headerTitleAlign:'center'
       }} />
   
          
     </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})