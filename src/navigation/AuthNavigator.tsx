import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';


export type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
      
  };
const Stack = createNativeStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
    
   

  </Stack.Navigator>
  )
}