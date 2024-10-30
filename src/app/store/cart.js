import { createSlice } from "@reduxjs/toolkit";

const initialCartItems = {
  items: [],
  totalQuantity: 0,
  changed: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartItems,
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },

    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      //state.totalQuantity++;
      state.totalQuantity = newItem.quantity ? state.totalQuantity + newItem.quantity : state.totalQuantity + 1;
      state.changed = true;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity ? newItem.quantity : 1,
          totalPrice: newItem.quantity ? newItem.price * newItem.quantity : newItem.price,
        })
      } else {
        existingItem.quantity = newItem.quantity ? existingItem.quantity + newItem.quantity : existingItem.quantity + 1;
        existingItem.totalPrice = newItem.quantity ? existingItem.totalPrice + newItem.price * newItem.quantity : existingItem.totalPrice + newItem.price;
      }
    },

    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    }
  }
})

export const cartActions = cartSlice.actions;

export default cartSlice;