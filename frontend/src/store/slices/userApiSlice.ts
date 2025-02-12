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
          headers.delete('Authorization'); // Ensure old headers are removed
      }
      return headers;
  }
});

const baseQueryWithReauth = async (args: BaseQueryArgs, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    
    if (result.error?.status === 401) {
        // Try to refresh token
        const refreshResult = await baseQuery(
            { 
                url: '/auth/refresh-token', 
                method: 'POST',
                credentials: 'include'
            },
            api,
            extraOptions
        );
        
        if (refreshResult.data) {
            // Store the new token
            localStorage.setItem('userToken', (refreshResult.data as { accessToken: string }).accessToken);
            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed - logout
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    }
    return result;
};

export const userApiSlice = createApi({
  tagTypes: ['Profile', 'SavedPosts'],
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<{ success: boolean; data: any; message?: string }, any>({
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
    login: builder.mutation<{ 
      success: boolean; 
      user: User; 
      tokens: {
        accessToken: string;
        refreshToken: string;
      }
    }, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include'
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
    verifyOtp: builder.mutation<any, { 
      phoneNumber: string; 
      email: string; 
      otp: string 
    }>({
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
    getProfile: builder.query<User, void>({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      }),
      transformResponse: (response: any) => {
        console.log('Profile response:', response);
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Failed to fetch profile');
      },
      providesTags: [{ type: 'Profile', id: 'LIST' }],
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
    toggleSavePost: builder.mutation<any, { 
      postId: string; 
      method: 'POST' | 'DELETE' 
    }>({
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
    getSavedPosts: builder.query<Array<{
      _id: string;
      title: string;
      content: string;
      media: string;
      mediaType: string;
      channelName: string;
      likesCount: number;
      commentsCount: number;
      createdAt: string;
      updatedAt: string;
    }>, void>({
      query : () => ({ url: '/api/users/posts/saved', method: 'GET' }),
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
