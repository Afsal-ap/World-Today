// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { userApiSlice } from './slices/userApiSlice';

export const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware ) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});
