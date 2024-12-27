import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const channelApiSlice = createApi({
  reducerPath: 'channelApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('channelToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    channelRegister: builder.mutation({
      query: (formData) => {
        console.log('Sending registration data:', formData);
        return {
          url: '/auth/register',
          method: 'POST',
          body: formData,
          formData: true,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
    }),
    channelVerifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    channelLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getChannelDashboard: builder.query({
      query: () => ({
        url: '/channel/dashboard',
        method: 'GET',
      }),
    }),
  }),
});

export const { 
  useChannelRegisterMutation,
  useChannelVerifyOtpMutation,
  useChannelLoginMutation,
  useGetChannelDashboardQuery,
} = channelApiSlice; 