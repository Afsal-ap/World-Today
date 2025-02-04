// user 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id?: string;
  email?: string;
  name?: string;
  isBlocked?: boolean;
  // ... add other user properties
}

interface ProfileResponseDto {
  status: string;
  data: User;
  message?: string;
}

export const userApiSlice = createApi({
  tagTypes: ['Profile', 'SavedPosts'],
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
        body: {
          ...userData,
          // Ensure phone number is properly formatted
          phone: userData.phone.replace(/[^\d+]/g, '')
        },    
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
          // Check if user is blocked
          if (response.user.isBlocked) {
            throw new Error('Your account has been blocked. Please contact support.');
          }
          const token = response.tokens.accessToken;
          localStorage.setItem('userToken', token);
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
        body: { phoneNumber: data.phoneNumber },
      }),
    }),
    verifyOtp: builder.mutation({
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
          data: response.data
        };
      }
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        console.log('Profile response:', response);
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Failed to fetch profile');
      },
      providesTags: [{ type: 'Profile', id: 'LIST' }], // Associate the query with the Profile tag
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
          message: error.data?.message || 'Failed to update profile'
        };
      },
      invalidatesTags: [{ type: 'Profile', id: 'LIST' }],
    }),
    toggleSavePost: builder.mutation({
      query: ({ postId, method }) => ({
        url: '/api/users/posts/save',
        method: method,
        body: { postId },
      }),
      transformResponse: (response: any) => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error('Failed to toggle save status');
      },
    }),
    getSavedPosts: builder.query({
      query: () => '/api/users/posts/saved',
      providesTags: ['SavedPosts'],
      transformResponse: (response: any) => {
        console.log('Saved posts response:', response);
        if (!response) {
          console.error('Empty response received');
          return [];
        }
        if (response.status === 'success') {
          if (!Array.isArray(response.data)) {
            console.error('Response data is not an array:', response.data);
            return [];
          }
          return response.data.map((post: any) => ({
            _id: post.id || post._id, // Handle both cases
            title: post.title || '',
            content: post.content || '',
            media: post.media_url || post.media || '',
            mediaType: post.media_type || post.mediaType || '',
            channelName: post.channel_name || post.channelName || 'Unknown Channel',
            likesCount: post.likes_count || post.likesCount || 0,
            commentsCount: post.comments_count || post.commentsCount || 0,
            createdAt: post.created_at || post.createdAt || '',
            updatedAt: post.updated_at || post.updatedAt || ''
          }));
        }
        return [];
      },
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
} = userApiSlice;
