/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RootNavigator from './src/navigation/RootNavigator';

import AuthNavigator from './src/navigation/AuthNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  RootNavigator: undefined;
  Auth: undefined;
  Chat: { username: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>


     
    <NavigationContainer>
   
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
        
        <Stack.Screen name="RootNavigator" component={RootNavigator} />
      
      </Stack.Navigator>
 
    </NavigationContainer>

    </GestureHandlerRootView>
  );
};

export default App;

