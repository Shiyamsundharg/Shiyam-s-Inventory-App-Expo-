import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/redux/store";
import { hydrateProducts } from "./src/slices/productSlice";
import { hydrateCart } from "./src/slices/cartSlice";
import { loadPersistedState, savePersistedState } from "./src/utils/storage";
import OpeningSplashScreen from "./src/screens/OpeningSplashScreen";

function Bootstrap() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showOpeningSplash, setShowOpeningSplash] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrateStore = async () => {
      const persistedState = await loadPersistedState();
      store.dispatch(hydrateProducts(persistedState.products));
      store.dispatch(hydrateCart(persistedState.cart));

      if (mounted) {
        setIsHydrated(true);
      }
    };

    hydrateStore();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return undefined;
    }

    let timeoutId;
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        savePersistedState({
          products: state.products.products,
          cart: state.cart.items,
        });
      }, 250);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowOpeningSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHydrated]);

  if (!isHydrated || showOpeningSplash) {
    return <OpeningSplashScreen />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Bootstrap />
    </Provider>
  );
}
