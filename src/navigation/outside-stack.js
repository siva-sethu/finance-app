
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { Routes } from './routes';
import login from '../screens/auth/login';
import LoginScreen from '../screens/auth/login';


const Stack = createStackNavigator();

export const OutsideStack = () => {
  return (
  
      <Stack.Navigator screenOptions={{ headerShown: false }}>
       
        <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
       
      </Stack.Navigator>
 
  );
};

export default OutsideStack;