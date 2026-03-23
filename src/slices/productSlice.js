import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    hydrateProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    },
    addProduct: (state, action) => {
      const incomingProduct = action.payload;
      const duplicate = state.products.some(
        (product) =>
          product.barcode.toLowerCase() === incomingProduct.barcode.toLowerCase()
      );

      if (!duplicate) {
        state.products.push(incomingProduct);
      }
    },
    updateProductQuantity: (state, action) => {
      const { barcode, quantity } = action.payload;
      const targetProduct = state.products.find(
        (product) => product.barcode.toLowerCase() === barcode.toLowerCase()
      );

      if (targetProduct) {
        targetProduct.quantity = Math.max(0, Number(quantity) || 0);
      }
    },
    deductProductQuantity: (state, action) => {
      const cartItems = Array.isArray(action.payload) ? action.payload : [];

      cartItems.forEach((cartItem) => {
        const targetProduct = state.products.find(
          (product) =>
            product.barcode.toLowerCase() === cartItem.barcode.toLowerCase()
        );

        if (targetProduct) {
          targetProduct.quantity = Math.max(
            0,
            targetProduct.quantity - cartItem.quantity
          );
        }
      });
    },
  },
});

export const {
  hydrateProducts,
  addProduct,
  updateProductQuantity,
  deductProductQuantity,
} = productSlice.actions;

export default productSlice.reducer;
