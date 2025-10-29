/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/auth/LoginScreen";
import ChatScreen from "./src/screens/ChatScreen";
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  RootNavigator: undefined;
  Login: undefined;
  Chat: { username: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (

    <NavigationContainer>
   
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RootNavigator" component={RootNavigator} />
      
      </Stack.Navigator>
 
    </NavigationContainer>

  );
};

export default App;

