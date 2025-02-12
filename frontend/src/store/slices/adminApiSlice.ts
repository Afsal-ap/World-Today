import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      console.log('Tokennney', token)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Category', 'Users', 'Channels'],
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
      transformResponse: (response: any) => {
        console.log('Response from server:', response);
        if (response.status === 'success') {
          return {
            users: response.data.users.map((user: any) => ({
              _id: user.id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              isBlocked: user.isBlocked
            })),
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage
          };
        }
        throw new Error('Failed to fetch users');
      },
      providesTags: ['Users']
    }),
   
    updateUserStatus: builder.mutation({
      query: ({ userId, isAdmin }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PATCH',
        body: { isAdmin },
      }),
      invalidatesTags: ['Users']
    }),
    updateUserBlockStatus: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `/admin/users/${userId}/block`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse: (response: { status: number, data: any }) => {
        return response.data?.message || 'Failed to update block status';
      },
    }),
    getCategories: builder.query({
      query: () => '/admin/categories',
      transformResponse: (response: any) => {
        console.log('Raw categories response:', response);
        if (response?.status === 'success' && response?.data) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        throw new Error(response?.message || 'Failed to fetch categories');
      },
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
    updateCategory: builder.mutation 
        ({
        query: ({ id, ...body }) => ({
            url: `/admin/categories/${id}`,
            method: 'PUT',
            body
        }),
        invalidatesTags: ['Category'],
    })
    
  }),
});

export const {
  useAdminLoginMutation,
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserBlockStatusMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = adminApiSlice; 