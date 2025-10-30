import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GroupAreaScreen from '../../screens/buyTrip/GroupAreaScreen';
import BuyTripScreen from '../../screens/buyTrip/BuyTripScreen';

export type BuyTripStackParamList ={
  GroupArea: undefined;
  BuyTrip: undefined;
  
}

 const Stack = createNativeStackNavigator<BuyTripStackParamList>();
 export default function BuyTripTabs() {
   return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>

     <Stack.Screen name="GroupArea" component={GroupAreaScreen} />
     <Stack.Screen name="BuyTrip" component={BuyTripScreen} />
        
   </Stack.Navigator>
   )
 
}