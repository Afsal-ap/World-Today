import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id?: string;
  email?: string;
  name?: string;
  isBlocked?: boolean;
}


export interface Comment {
  _id: string;
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
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
  baseUrl: 'http://localhost:3001',    
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log("Attached token:", token);
    } else {
      console.log("No token found in localStorage");
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
  tagTypes: ['Profile', 'SavedPosts', 'Subscription', 'Comments', 'Post'],
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

   
    getPosts: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `http://localhost:3004/api/posts?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        // assume backend sends { data: Post[], total: number }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    
    

    getDetailPost: builder.query({
      query: (id: string) => ({
        url: `http://localhost:3004/api/posts/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: any) => {
        const post = response?.data || {};
        if (post.createdAt) {
          post.createdAt = new Date(post.createdAt).toISOString();
        }
        if (post.updatedAt) {
          post.updatedAt = new Date(post.updatedAt).toISOString();
        }
        return post;
      },
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
    

    // Get all comments for a post
    getComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: `http://localhost:3004/api/posts/${postId}/comments`,
        method: 'GET',
      }),
      transformResponse: (response: { status: string; data: Comment[] }) => {
        return response.data; // clean array
      },
      providesTags: (result, _error, postId) =>
        result
          ? [
              ...result.map((comment) => ({ type: 'Comments' as const, id: comment._id })),
              { type: 'Comments', id: 'LIST' },
              { type: 'Post', id: postId },
            ]
          : [{ type: 'Comments', id: 'LIST' }, { type: 'Post', id: postId }],
    }),
    

// Create comment
createComment: builder.mutation<Comment, { postId: string; data: any }>({
  query: ({ postId, data }) => ({
    url: `http://localhost:3004/api/posts/${postId}/comments`,
    method: 'POST',
    body: data,
  }),
  invalidatesTags: (_result, _error, { postId }) => [
    { type: 'Comments', id: 'LIST' },
    { type: 'Post', id: postId }
  ],
}),

// Update comment
updateComment: builder.mutation<Comment, { postId: string; commentId: string; data: any }>({
  query: ({ postId, commentId, data }) => ({
    url: `http://localhost:3004/api/posts/${postId}/comments/${commentId}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: (_result, _error, { postId, commentId }) => [
    { type: 'Comments', id: commentId },
    { type: 'Post', id: postId }
  ],
}),

// Delete comment
deleteComment: builder.mutation<{ success: boolean }, { postId: string; commentId: string }>({
  query: ({ postId, commentId }) => ({
    url: `http://localhost:3004/api/posts/${postId}/comments/${commentId}`,
    method: 'DELETE',
  }),
  invalidatesTags: (_result, _error, { postId, commentId }) => [
    { type: 'Comments', id: commentId },
    { type: 'Comments', id: 'LIST' },
    { type: 'Post', id: postId }
  ],
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

    likePost: builder.mutation<
    { liked: boolean; likesCount: number },
    string
  >({
    query: (postId) => ({
      url: `http://localhost:3004/api/posts/${postId}/like`,
      method: 'POST',
    }),
    async onQueryStarted(postId, { dispatch, queryFulfilled }) {
      // Optimistically update cache
      const patchResult = dispatch(
        userApiSlice.util.updateQueryData(
          "getPosts",
          { page: 1, limit: 10 }, 
          (draft: any) => {
            const post = draft.find((p: any) => p._id === postId);
            if (post) {
              post.isLiked = !post.isLiked;
              post.likesCount += post.isLiked ? 1 : -1;
            }
          }
        )
      );
  
      try {
        await queryFulfilled; // wait for server response
      } catch {
        patchResult.undo(); // rollback if API fails
      }
    },
    invalidatesTags: (result, error, postId) => [
      { type: "Post", id: postId },
      { type: "Post", id: "LIST" },
    ],
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
  useGetDetailPostQuery,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikePostMutation,
  useGetPostsQuery
} = userApiSlice;