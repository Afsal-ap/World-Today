// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { userApiSlice } from './slices/userApiSlice';
import { adminApiSlice } from './slices/adminApiSlice';
import { adApiSlice } from './slices/adApiSlice';
import { postApiSlice } from './slices/postApiSlice';
import adminAuthReducer from './slices/adminAuthSlice';

export const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [adApiSlice.reducerPath]: adApiSlice.reducer,
    [postApiSlice.reducerPath]: postApiSlice.reducer,
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      adminApiSlice.middleware,
      adApiSlice.middleware,
      postApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
