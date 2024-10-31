import { configureStore } from "@reduxjs/toolkit";
import cartSlice from '@/app/store/cart';
import uiSlice from '@/app/store/ui';
import orderSlice from '@/app/store/order';
import modalSlice from '@/app/store/modal';

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    modal: modalSlice.reducer,
    order: orderSlice.reducer,
  }
})

export default store;