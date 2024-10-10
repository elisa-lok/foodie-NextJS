import { configureStore } from "@reduxjs/toolkit";
import cartSlice from '@/app/store/cart';
import uiSlice from '@/app/store/ui';
import modalSlice from '@/app/store/modal';

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    modal: modalSlice.reducer,
  }
})

export default store;