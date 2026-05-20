import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const storeTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreTypes: builder.query({
      query: ({ page = 1, limit = 10, categoryId } = {}) => ({
        url: endPoints.STORE_TYPE,
        method: 'GET',
        params: { page, limit, ...(categoryId && { categoryId }) },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['StoreType'],
      transformResponse: (response) => response.data || response
    }),
    getAllStoreTypes: builder.query({
      query: () => ({
        url: endPoints.STORE_TYPE,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['StoreType'],
      transformResponse: (response) => {
        const data = response.data || response;
        return Array.isArray(data) ? data : data?.data || [];
      }
    }),
    getStoreTypeById: builder.query({
      query: (id) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'StoreType', id }]
    }),
    createStoreType: builder.mutation({
      query: (payload) => ({
        url: `${endPoints.STORE_TYPE}/`,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['StoreType']
    }),
    updateStoreType: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['StoreType', { type: 'StoreType', id }]
    }),
    deleteStoreType: builder.mutation({
      query: (id) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['StoreType']
    })
  })
});

export const {
  useGetStoreTypesQuery,
  useGetAllStoreTypesQuery,
  useGetStoreTypeByIdQuery,
  useCreateStoreTypeMutation,
  useUpdateStoreTypeMutation,
  useDeleteStoreTypeMutation
} = storeTypeApi;
