// user 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('userToken');
      console.log('Token in prepareHeaders:', token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('Full authorization header:', headers.get('authorization'));
      } else {
        console.log('No token found in localStorage'); 
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,    
      }),
      transformResponse: (response: any) => {
        console.log('Registration response:', response);
        if (response.success) {
          return {
            success: true,
            data: response.data,
            message: response.message
          };
        }
        throw new Error(response.error || 'Registration failed');
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.error('Registration error:', error);
        return {
          success: false,
          error: error.data?.message || error.data?.error || 'Registration failed'
        };
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        console.log('Full login response:', response);
        if (response.user && response.tokens) {
          const token = response.tokens.accessToken;
          console.log('Token being stored:', token);
          localStorage.setItem('userToken', token);
          console.log('Token after storage:', localStorage.getItem('userToken'));
          return {
            success: true,
            user: response.user,
            tokens: response.tokens
          };
        }
        throw new Error('Login failed');
      },     
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.log('Login error response:', error);
        return {
          success: false,
          error: error.data?.error || 'Login failed'
        };
      },
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: { email: data.email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        console.log('OTP Verification Response:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.log('OTP Verification Error:', response);
        return {
          status: response.status,
          data: response.data
        };
      }
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      }),
      transformResponse: (response: any) => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error('Failed to fetch profile');
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        return {
          status: error.status,
          message: error.data?.message || 'Failed to fetch profile'
        };
      }
    }),
  }),
});

export const { 
    useRegisterMutation, 
    useLoginMutation,
    useSendOtpMutation, 
    useVerifyOtpMutation,
    useGetProfileQuery 
} = userApiSlice;
