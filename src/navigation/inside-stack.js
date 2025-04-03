import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './routes';
import { useIsFocused } from '@react-navigation/native';
import Home from '../screens/app/home';
import Maps from '../screens/app/maps';
import Data from '../screens/app/data';



const Stack = createStackNavigator();

// const ScreenWithFocus = ({ component: Component, route }) => {
//   const isFocused = useIsFocused();
//   return <Component isFocused={isFocused} />;
// };

export const InsideStack = () => {
  return (


    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
       
        <Stack.Screen name={Routes.HOME} component={Home} />
        <Stack.Screen name={Routes.MAPS} component={Maps} />
        <Stack.Screen name={Routes.DATA} component={Data} />

       
      </Stack.Navigator>
 

  );
};

export default InsideStack;