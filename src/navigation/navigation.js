import {useState, useEffect, useRef} from 'react';

export const RootNavigation = {
  navigate() {},
  goBack() {},
  resetRoot() {},
  getRootState() {},
  getCurrentRoute() {},
};

export const setRootNavigation = ref => {
  const getMethod = (method, ...args) => {
    return function (...args) {
      if (ref.current) {
        return ref.current[method](...args);
      }
    };
  };
  for (const method in RootNavigation) {
    RootNavigation[method] = getMethod(method);
  }
};

function getActiveRouteName(state) {
  const route = state.routes[state.index];
  if (!route.state) {
    return route.name;
  }
  return getActiveRouteName(route.state);
}

export function useNavigationPersistence(storage, persistenceKey) {
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [isRestoringNavigationState, setIsRestoringNavigationState] =
    useState(false);
  const routeNameRef = useRef();
  const onNavigationStateChange = state => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);
    if (previousRouteName !== currentRouteName) {
    }
    routeNameRef.current = currentRouteName;
    storage?.save(persistenceKey, state);
  };

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey);
      if (state) {
        setInitialNavigationState(state);
      }
    } finally {
      setIsRestoringNavigationState(false);
    }
  };

  useEffect(() => {
    if (isRestoringNavigationState) {
      restoreState();
    }
  }, [isRestoringNavigationState]);

  return {
    onNavigationStateChange,
    restoreState,
    initialNavigationState,
    RootNavigation,
  };
}

export const dialogOptions = {
  headerShown: false,

  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
      backgroundColor: 'black',
    },
  }),
};

export const popoverOptions = {
  headerShown: false,
  cardStyle: {backgroundColor: 'transparent'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
  }),
};