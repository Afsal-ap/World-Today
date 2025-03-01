import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateAdDTO } from '../../types/ad';

export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

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
    createPaymentIntent: builder.mutation<StripePaymentIntent, { amount: number, placement: string }>({
      query: (data) => ({
        url: '/api/ads/create-payment-intent',
        method: 'POST',
        body: data,
      }),
    }),
    createAd: builder.mutation<any, { adData: CreateAdDTO, paymentIntentId: string }>({
      query: ({ adData, paymentIntentId }) => ({
        url: '/api/ads',
        method: 'POST',
        body: {
          ...adData,
          paymentIntentId,
        },
      }),
    }),
    uploadAdImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: '/api/ads/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),
    getAdPricing: builder.query<Record<string, number>, void>({
      query: () => '/api/ads/ad-pricing',
    }),
  }),
});

export const { 
  useAdvertiserRegisterMutation,
  useAdvertiserLoginMutation,
  useVerifyOtpMutation,
  useCreatePaymentIntentMutation,
  useCreateAdMutation,
  useUploadAdImageMutation,
  useGetAdPricingQuery,
} = adApiSlice;