import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chatReducer';

const store = configureStore({
  reducer: { chatReducer },
});

export default store;
