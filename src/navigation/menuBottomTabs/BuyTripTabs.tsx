import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BuyTripScreen from '../../screens/buyTrip/BuyTripScreen';

export type BuyTripStackParamList ={
    BuyTripScreen: undefined;
  
}

 const Stack = createNativeStackNavigator<BuyTripStackParamList>();
 export default function BuyTripTabs() {
   return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>

     <Stack.Screen name="BuyTripScreen" component={BuyTripScreen} />
        
   </Stack.Navigator>
   )
 
}