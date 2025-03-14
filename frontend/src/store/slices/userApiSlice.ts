import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode'; // Install with `npm install jwt-decode`

interface User {
  id?: string;
  email?: string;
  name?: string;
  isBlocked?: boolean;
}

interface ProfileResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface BaseQueryArgs {
  url: string;
  method: string;
  body?: any;
  credentials?: RequestCredentials;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers.delete('Authorization');
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: BaseQueryArgs, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      localStorage.setItem('userToken', (refreshResult.data as { accessToken: string }).accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
  return result;
};

export const userApiSlice = createApi({
  tagTypes: ['Profile', 'SavedPosts', 'Subscription'],
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Existing endpoints...
    register: builder.mutation<{ success: boolean; data: any; message?: string }, any>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          ...userData,
          phone: userData.phone.replace(/[^\d+]/g, ''),
        },
      }),
      transformResponse: (response: any) => {
        console.log('Registration response:', response);
        if (response.success) {
          return {
            success: true,
            data: response.data,
            message: response.message,
          };
        }
        throw new Error(response.error || 'Registration failed');
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.error('Registration error:', error);
        return {
          success: false,
          error: error.data?.message || error.data?.error || 'Registration failed',
        };
      },
    }),
    login: builder.mutation<
      {
        success: boolean;
        user: User;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      },
      any
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      transformResponse: (response: any) => {
        if (response.success && response.user && response.tokens) {
          return response;
        }
        throw new Error(response.error || 'Login failed');
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        return error.data;
      },
    }),
    sendOtp: builder.mutation<any, { phoneNumber: string }>({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: { phoneNumber: data.phoneNumber },
      }),
    }),
    verifyOtp: builder.mutation<
      any,
      { phoneNumber: string; email: string; otp: string }
    >({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: {
          phoneNumber: data.phoneNumber,
          email: data.email,
          otp: data.otp,
        },
      }),
      transformResponse: (response: any) => {
        console.log('OTP Verification Response:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.log('OTP Verification Error:', response);
        return {
          status: response.status,
          data: response.data,
        };
      },
    }),
    getProfile: builder.query<ProfileResponseDto, void>({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: any) => {
        console.log('Raw profile response:', response);
        if (response?.status === 'success' && response?.data) {
          return response.data;
        }
        if (response?.id && response?.email) {
          return response;
        }
        throw new Error('Invalid profile data format');
      },
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileResponseDto, Partial<User>>({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => {
        console.log('Update profile response:', response);
        if (response.status === 'success' && response.data) {
          return response;
        }
        throw new Error('Failed to update profile');
      },
      transformErrorResponse: (error: { status: number; data: any }) => {
        console.error('Update profile error:', error);
        return {
          status: 'error',
          data: null,
          message: error.data?.message || 'Failed to update profile',
        };
      },
      invalidatesTags: [{ type: 'Profile', id: 'LIST' }],
    }),
    toggleSavePost: builder.mutation<
      any,
      { postId: string; method: 'POST' | 'DELETE'; postTitle?: string }
    >({
      query: ({ postId, method, postTitle }) => ({
        url: '/api/users/posts/save',
        method: method,
        body: { postId, postTitle },
      }),
      transformResponse: (response: any) => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error('Failed to toggle save status');
      },
    }),
    getSavedPosts: builder.query<string[], void>({
      query: () => ({ url: '/api/users/posts/saved', method: 'GET' }),
      providesTags: ['SavedPosts'],
      transformResponse: (response: any) => {
        if (response?.status === 'success') {
          return response.data;
        }
        return [];
      },
    }),
    // New endpoint for subscription status
    getSubscriptionStatus: builder.query<{ isSubscribed: boolean }, void>({
      query: () => {
        const token = localStorage.getItem('userToken'); 
        
        if (!token) throw new Error('No token found');
        const decoded = jwtDecode<{ userId: string }>(token);
        const userId = decoded.userId;
        
        if (!userId) throw new Error('No user ID found in token');
        console.log(userId, "userId from userApiSlice");
        
        return {
          url: `/api/subscription/subscription-status?userId=${userId}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      transformResponse: (response: any) => {
        console.log('Subscription status response:', response);
        return { isSubscribed: response.isSubscribed || false };
      },
      providesTags: ['Subscription'],
    }),
    createSubscription: builder.mutation({
      query: ({ userId, paymentMethodId }) => ({
        url: '/api/subscription/create-subscription',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { userId, paymentMethodId },
      }),
    }),
   
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useToggleSavePostMutation,
  useGetSavedPostsQuery,
  useGetSubscriptionStatusQuery, 
  useCreateSubscriptionMutation,
  
} = userApiSlice;