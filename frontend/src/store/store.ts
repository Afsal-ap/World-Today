// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { userApiSlice } from './slices/userApiSlice';
import { channelApiSlice } from './slices/channelApiSlice';
import { adApiSlice } from './slices/adApiSlice';

export const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [channelApiSlice.reducerPath]: channelApiSlice.reducer,
    [adApiSlice.reducerPath]: adApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,   
      channelApiSlice.middleware,
      adApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
