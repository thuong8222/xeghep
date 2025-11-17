import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BlankScreen from '../screens/auth/BlankScreen';


export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  BlankScreen: { typeScreen: string };
};
const Stack = createNativeStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="BlankScreen"
        component={BlankScreen}
        options={({ route }) => ({
          title: route.params?.typeScreen || 'Default Title', // hiển thị nameScreen trên header
        })}
      />



    </Stack.Navigator>
  )
}