import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './routes';
import { useIsFocused } from '@react-navigation/native';
import Home from '../screens/app/home';



const Stack = createStackNavigator();

// const ScreenWithFocus = ({ component: Component, route }) => {
//   const isFocused = useIsFocused();
//   return <Component isFocused={isFocused} />;
// };

export const InsideStack = () => {
  return (


    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
       
        <Stack.Screen name={Routes.HOME} component={Home} />
        

       
      </Stack.Navigator>
 

  );
};

export default InsideStack;