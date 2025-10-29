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

import RootNavigator from './src/navigation/RootNavigator';

import AuthNavigator from './src/navigation/AuthNavigator';

export type RootStackParamList = {
  RootNavigator: undefined;
  Auth: undefined;
  Chat: { username: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (

    <NavigationContainer>
   
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
        
        <Stack.Screen name="RootNavigator" component={RootNavigator} />
      
      </Stack.Navigator>
 
    </NavigationContainer>

  );
};

export default App;

