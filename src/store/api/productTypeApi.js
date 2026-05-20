import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const productTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductTypes: builder.query({
      query: ({ page = 1, limit = 10, categoryId } = {}) => ({
        url: endPoints.PRODUCT_TYPE,
        method: 'GET',
        params: { page, limit, ...(categoryId && { categoryId }) },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['ProductType'],
      transformResponse: (response) => response.data || response
    }),
    getProductTypeById: builder.query({
      query: (id) => ({
        url: `${endPoints.PRODUCT_TYPE}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'ProductType', id }]
    }),
    createProductType: builder.mutation({
      query: (payload) => ({
        url: `${endPoints.PRODUCT_TYPE}/`,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['ProductType']
    }),
    updateProductType: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.PRODUCT_TYPE}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['ProductType', { type: 'ProductType', id }]
    }),
    deleteProductType: builder.mutation({
      query: (id) => ({
        url: `${endPoints.PRODUCT_TYPE}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['ProductType']
    })
  })
});

export const {
  useGetProductTypesQuery,
  useGetProductTypeByIdQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation
} = productTypeApi;
