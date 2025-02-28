import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adApiSlice = createApi({
  reducerPath: 'adApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3002',
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem('advertiserToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    advertiserRegister: builder.mutation({
      query: (data) => ({
        url: '/advertiser/register',
        method: 'POST',
        body: data,
      }),
    }),
    advertiserLogin: builder.mutation({
      query: (credentials) => ({
        url: '/advertiser/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/advertiser/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
  useAdvertiserRegisterMutation,
  useAdvertiserLoginMutation,
  useVerifyOtpMutation,
} = adApiSlice;