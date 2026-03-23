import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@inventory_app_state_v1";

export const loadPersistedState = async () => {
  try {
    const rawState = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return {
        products: [],
        cart: [],
      };
    }

    const parsed = JSON.parse(rawState);

    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
    };
  } catch (error) {
    console.error("Failed to load inventory state:", error);
    return {
      products: [],
      cart: [],
    };
  }
};

export const savePersistedState = async ({ products, cart }) => {
  try {
    const payload = JSON.stringify({
      products: Array.isArray(products) ? products : [],
      cart: Array.isArray(cart) ? cart : [],
    });
    await AsyncStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.error("Failed to save inventory state:", error);
  }
};
