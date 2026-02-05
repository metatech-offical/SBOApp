import {createSlice} from '@reduxjs/toolkit';

const initialState: {
  cartItemsCount: number;
} = {
  cartItemsCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, {payload}) => {
      state.cartItemsCount = payload || 0;
    },
    incrementCartCount: (state, {payload}) => {
      state.cartItemsCount = (state.cartItemsCount || 0) + payload;
    },
    decrementCartCount: (state, {payload}) => {
      state.cartItemsCount = (state.cartItemsCount || 0) - payload;
    },
    resetCartCount: state => {
      state.cartItemsCount = 0;
    },
  },
});

export const {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
  resetCartCount,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
