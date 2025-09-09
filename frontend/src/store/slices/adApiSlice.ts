import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Ad, CreateAdDTO } from '../../types/ad';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.worldtoday.shop' 
console.log("hello")
export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export const adApiSlice = createApi({ 
  reducerPath: 'adApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3002',
    prepareHeaders: (headers, ) => {
      // Get token from localStorage
      const token = localStorage.getItem('advertiserToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Ads'],
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
    createAd: builder.mutation<
    { message: string; ad: Ad; paymentIntentId: string },
    { adData: CreateAdDTO; paymentIntentId: string }
  >({
    query: ({ adData, paymentIntentId }) => {
      const body = { adData, paymentIntentId };
      console.log("Sending body to /api/ads/create-ad:", body); // Debugging log
      return {
        url: '/api/ads/create-ad',
        method: 'POST',
        body,
      };
    },
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
    getAdsByAdvertiser: builder.query({
      query: (advertiserId) => `/api/ads/${advertiserId}`,
    }),
    deleteAd: builder.mutation({
      query: (adId) => ({
        url: `/api/ads/delete-ad/${adId}`,
        method: 'DELETE',
      }),
    }),
    getActiveAds: builder.query<Ad[], void>({
      query: () => '/api/ads/active-ads',
      providesTags: ['Ads'],
    }),
    getAdvertiserStats: builder.query({
      query: () => '/api/dashboard/getAdvertiserStats',
    }),
    getAdChart: builder.query({
      query: (period = 'daily') => `/api/dashboard/getAdChart?period=${period}`,
      transformResponse: (response: any) => {
        console.log('Chart response:', response);
        return response?.data || [];
      },
      providesTags: ['Ads'],
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
  useGetAdsByAdvertiserQuery,
  useDeleteAdMutation,
  useGetActiveAdsQuery,
  useGetAdvertiserStatsQuery,
  useGetAdChartQuery
  
} = adApiSlice;