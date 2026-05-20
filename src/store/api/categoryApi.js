import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: endPoints.CATEGORIES,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Category'],
      transformResponse: (response) => response.data || response
    }),
    getCategoryById: builder.query({
      query: (id) => ({
        url: `${endPoints.CATEGORIES}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }]
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: endPoints.CATEGORIES,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Category']
    }),
    updateCategory: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.CATEGORIES}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Category', { type: 'Category', id }]
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${endPoints.CATEGORIES}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Category']
    })
  })
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
