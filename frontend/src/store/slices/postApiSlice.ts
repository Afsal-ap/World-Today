import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApiSlice = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3004',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('channelToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Post', 'Channel'],
  endpoints: (builder) => ({
    // Post endpoints
    getPosts: builder.query({
      query: () => '/api/posts',
      providesTags: ['Post']
    }),
    createPost: builder.mutation({
      query: ({ body }) => ({
        url: '/api/posts',
        method: 'POST',
        body,
        formData: true,
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          const token = localStorage.getItem('channelToken');
          if (token) {
            headers.set('authorization', `Bearer ${token}`);
          }
          return headers;
        },
      }),
      invalidatesTags: ['Post']
    }),

    // Channel endpoints
    channelRegister: builder.mutation({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
        formData: true,
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      transformResponse: (response: any) => {
        if (response.email) {
          return {
            success: true,
            email: response.email,
            message: response.message
          };
        }
        throw new Error('Registration failed');
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
      query: () => '/api/channel/dashboard',
      providesTags: ['Channel']
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: { email }
      })
    }),
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/api/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post']
    }),
    getPost: builder.query({
      query: (id) => `/api/posts/${id}`,
      providesTags: ['Post']
    }),
    createComment: builder.mutation({
      query: ({ postId, content, userId }) => ({
        url: `/api/posts/${postId}/comments`,
        method: 'POST',
        body: { content, userId }
      }),
      invalidatesTags: ['Post']
    }),
    getPostComments: builder.query({
      query: (postId) => `/api/posts/${postId}/comments`,
      providesTags: (_result, _error, postId) => [
        { type: 'Post', id: postId },
        'Post'
      ]
    }),
    getChannelProfile: builder.query({
      query: () => '/api/channel/dashboard/profile',
      providesTags: ['Channel']
    }),
    updateChannelProfile: builder.mutation({
      query: (data) => ({
        url: '/api/channel/dashboard/profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Channel']
    }),
    getChannelPosts: builder.query({
      query: () => '/api/posts/channel/posts',
      providesTags: ['Post']
    }),
  }),
});

export const { 
  // Post exports
  useGetPostsQuery,
  useCreatePostMutation,
  // Channel exports
  useChannelRegisterMutation,
  useChannelVerifyOtpMutation,
  useChannelLoginMutation,
  useGetChannelDashboardQuery,
  useResendOtpMutation,
  useDeleteCommentMutation,
  useGetPostQuery,
  useCreateCommentMutation,
  useGetPostCommentsQuery,
  useGetChannelProfileQuery,
  useUpdateChannelProfileMutation,
  useGetChannelPostsQuery
} = postApiSlice;