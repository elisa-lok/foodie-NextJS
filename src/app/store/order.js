import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderInfo: null,
  },
  reducers: {
    saveOrderInfo(state, action) {
      state.orderInfo = action.payload;
    }
    ,
    clearOrderInfo(state) {
      state.orderInfo = null;
    }
  }
});


export const {saveOrderInfo, clearOrderInfo} = orderSlice.actions;

export default orderSlice;