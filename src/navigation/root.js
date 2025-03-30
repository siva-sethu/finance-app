import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Routes } from './routes';
import OutsideStack from './outside-stack';
import InsideStack from './inside-stack';



const Stack = createStackNavigator();

export const RootNavigator = React.forwardRef((props, ref) => {
    return (
        // <View style={{ flex: 1 }}>
        <NavigationContainer {...props} ref={ref}>
            <>
                <StatusBar barStyle="dark-content" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>

                    <Stack.Screen name={Routes.OUTSIDE_STACK} component={OutsideStack} />

                    <Stack.Screen name={Routes.INSIDE_STACK} component={InsideStack} />
                </Stack.Navigator>
            </>
        </NavigationContainer>

        // </View>
    );

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    drawer: {
        width: 300,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        backgroundColor: '#fff',
        zIndex: 100,
    },
    main: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});