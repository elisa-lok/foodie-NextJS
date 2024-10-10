import { createSlice } from "@reduxjs/toolkit";

const initialModalState = {
  isCartModalOpen: false,
  isCheckoutModalOpen: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    openCartModal(state) {
      state.isCartModalOpen = true;
    },
    closeCartModal(state) {
      state.isCartModalOpen = false;
    },
    openCheckoutModal(state) {
      state.isCheckoutModalOpen = true;
      state.isCartModalOpen = false;
    },
    closeCheckoutModal(state) {
      state.isCheckoutModalOpen = false;
    },
    openLoginModal(state) {
      state.isLoginModalOpen = true;
    },
    closeLoginModal(state) {
      state.isLoginModalOpen = false;
    },
    openRegisterModal(state) {
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal(state) {
      state.isRegisterModalOpen = false;
    }
  }
})

export const modalActions = modalSlice.actions;

export default modalSlice;