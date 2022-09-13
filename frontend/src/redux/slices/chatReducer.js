import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'CHAT SLICE',
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUserCredentialsToStore: (state) => {
      state.currentUser = JSON.parse(localStorage.getItem('userInfo'));
    },
  },
});

export default chatSlice.reducer;
export const { setCurrentUserCredentialsToStore } = chatSlice.actions;
