import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
    }),
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => `/admin/users?page=${page}&limit=${limit}`,
    }),
    getAllChannels: builder.query({
      query: ({ page = 1, limit = 10 }) => `/admin/channels?page=${page}&limit=${limit}`,
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, isAdmin }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PATCH',
        body: { isAdmin },
      }),
    }),
    getCategories: builder.query({
      query: () => '/admin/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/create-category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetAllChannelsQuery,
  useUpdateUserStatusMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApiSlice; 