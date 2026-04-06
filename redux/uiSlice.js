import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isAdminView: false,
    isDarkMode: true,
    isModalOpen: false,
    modalType: null,
    selectedTransaction: null,
  },
  reducers: {
    toggleView: (state) => { state.isAdminView = !state.isAdminView; },
    toggleTheme: (state) => { state.isDarkMode = !state.isDarkMode; },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.selectedTransaction = action.payload.data || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedTransaction = null;
    }
  },
});

export const { toggleView, toggleTheme, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;