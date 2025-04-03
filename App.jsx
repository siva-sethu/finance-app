import React, { useRef, useState, useEffect } from 'react';
import 'react-native-gesture-handler';


// import { RootNavigator, setRootNavigation, useNavigationPersistence } from './src/navigation';
import * as storage from './src/utils/storage'
import { NAVIGATION_PERSISTENCE_KEY } from './src/constants/keys';

import { View } from 'react-native';
import { setRootNavigation, useNavigationPersistence } from './src/navigation/navigation';
import { RootNavigator } from './src/navigation';
import { Provider } from 'react-redux';
import store from './src/redux/store';




const App = () => {

  const navigationRef = useRef();
  setRootNavigation(navigationRef);

  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);


  return (

    <Provider store={store}>

      <RootNavigator
        ref={navigationRef}
        initialState={initialNavigationState}
        onStateChange={onNavigationStateChange}
      />
    </Provider>
   

  );
};

export default App;

