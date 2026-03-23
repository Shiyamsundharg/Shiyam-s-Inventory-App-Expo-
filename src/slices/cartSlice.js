import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.barcode.toLowerCase() === product.barcode.toLowerCase()
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        barcode: product.barcode,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    },
    increaseCartQuantity: (state, action) => {
      const barcode = action.payload;
      const existingItem = state.items.find(
        (item) => item.barcode.toLowerCase() === barcode.toLowerCase()
      );

      if (existingItem) {
        existingItem.quantity += 1;
      }
    },
    decreaseCartQuantity: (state, action) => {
      const barcode = action.payload;
      const existingItem = state.items.find(
        (item) => item.barcode.toLowerCase() === barcode.toLowerCase()
      );

      if (!existingItem) {
        return;
      }

      if (existingItem.quantity <= 1) {
        state.items = state.items.filter(
          (item) => item.barcode.toLowerCase() !== barcode.toLowerCase()
        );
        return;
      }

      existingItem.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      const barcode = action.payload;
      state.items = state.items.filter(
        (item) => item.barcode.toLowerCase() !== barcode.toLowerCase()
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
