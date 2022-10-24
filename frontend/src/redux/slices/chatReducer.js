import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'CHAT SLICE',
  initialState: {
    currentUser: null,
    selectedChat: null,
    allChats: [],
    notifications: [],
  },
  reducers: {
    setCurrentUserCredentialsToStore: (state) => {
      state.currentUser = JSON.parse(localStorage.getItem('userInfo'));
    },
    setSelectedChatToStore: (state, { payload }) => {
      state.selectedChat = payload;
    },
    setChatsToStore: (state, { payload }) => {
      state.allChats = payload;
    },
    setNotificationsToStore: (state, { payload }) => {
      state.notifications = payload;
    },
  },
});

export default chatSlice.reducer;
export const {
  setCurrentUserCredentialsToStore,
  setSelectedChatToStore,
  setChatsToStore,
  setNotificationsToStore,
} = chatSlice.actions;
