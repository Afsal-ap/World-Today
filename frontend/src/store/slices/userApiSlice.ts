// user 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost' }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,    
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: 'auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: 'auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
    useRegisterMutation, 
    useSendOtpMutation, 
    useVerifyOtpMutation 
} = userApiSlice;
