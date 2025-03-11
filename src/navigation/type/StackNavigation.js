import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Local Imports
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={StackNav.HomeScreen}>
      <Stack.Screen
        name={StackNav.HomeScreen}
        component={StackRoute.HomeScreen}
      />

      <Stack.Screen
        name={StackNav.AddTimer}
        component={StackRoute.AddTimerScreen}
      />
      <Stack.Screen
        name={StackNav.History}
        component={StackRoute.HistoryScreen}
      />
    </Stack.Navigator>
  );
}
