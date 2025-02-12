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
  tagTypes: ['Post', 'Channel', 'Comments'],
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
    updatePost: builder.mutation({
      query: ({ postId, formData }) => ({
        url: `/api/posts/${postId}`,
        method: 'PUT',
        body: formData,
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
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Post', id: postId },
        'Post'
      ]
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/api/posts/${postId}`,
        method: 'DELETE',
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
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Post', id: postId },
        'Comments'
      ]
    }),
    getPost: builder.query({
      query: (id) => `/api/posts/${id}`,
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
      providesTags: (_result, _error, id) => [{ type: 'Post', id }]
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
      transformResponse: (response: any) => {
        return response?.data || [];
      },
      providesTags: (_result, _error, postId) => [
        { type: 'Post', id: postId },
        { type: 'Comments' }
      ]
    }),
    getChannelProfile: builder.query({
      query: () => '/api/channel/dashboard/profile',
      providesTags: ['Channel']
    }),

    getAllChannels: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/api/posts/admin/channels',
        method: 'GET',
        params: { page, limit }
      }),
      transformResponse: (response: any) => {
        if (response.status === 'success') {
          return {
            channels: response.data.channels.map((channel: any) => ({
              id: channel.id || channel._id,
              channelName: channel.channelName,
              email: channel.email,
              phoneNumber: channel.phoneNumber,
              websiteOrSocialLink: channel.websiteOrSocialLink,
              logo: channel.logo,
              isVerified: channel.isVerified,
              createdAt: channel.createdAt,
              postsCount: channel.postsCount,
              isBlocked: channel.isBlocked || false
            })),
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            totalChannels: response.data.totalChannels
          };
        }
        throw new Error('Failed to fetch channels');
      },
      providesTags: (result) => 
        result
          ? [
              ...result.channels.map(({ id }: { id: string }) => ({ 
                type: 'Channel' as const, 
                id 
              })),
              'Channel'
            ]
          : ['Channel']
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
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({ 
                type: 'Post' as const, 
                id: _id 
              })),
              'Post'
            ]
          : ['Post']
    }),
    toggleChannelBlock: builder.mutation({
      query: (channelId) => ({
        url: `/api/posts/admin/channels/${channelId}/toggle-block`,
        method: 'PUT'
      }),
      invalidatesTags: (result, error, channelId) => [
        { type: 'Channel', id: channelId },
        'Channel'
      ]
    }),
    updateComment: builder.mutation({
      query: ({ postId, commentId, content }) => ({
        url: `/api/posts/${postId}/comments/${commentId}`,
        method: 'PUT',
        body: { content }
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Post', id: postId },
        'Comments'
      ]
    }),
  }),
});

export const { 
  // Post exports
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
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
  useGetChannelPostsQuery,
  useGetAllChannelsQuery,
  useToggleChannelBlockMutation,
  useUpdateCommentMutation
} = postApiSlice;