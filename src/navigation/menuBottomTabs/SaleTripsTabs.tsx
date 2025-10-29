import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SaleTripsScreen from '../../screens/SaleTrips/SaleTripsScreen';

export type SaleTripsTabsParamList ={
    SaleTripsScreen: undefined;
  
}
 const Stack = createNativeStackNavigator<SaleTripsTabsParamList>();
export default function SaleTripsTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
   
        <Stack.Screen name="SaleTripsScreen" component={SaleTripsScreen} />
           
      </Stack.Navigator>
  )
}

