import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const merchantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerchants: builder.query({
      query: ({ page, limit, categoryId, status } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (categoryId) params.categoryId = categoryId;
        if (status) params.status = status;
        return {
          url: endPoints.MERCHANT,
          method: 'GET',
          params,
          showErrorToast: true,
          showSuccessToast: false
        };
      },
      providesTags: ['Merchant']
    }),
    getMerchantById: builder.query({
      query: (id) => ({
        url: endPoints.MERCHANT_BY_ID(id),
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Merchant', id }]
    }),
    addMerchant: builder.mutation({
      query: (payload) => ({
        url: endPoints.MERCHANT_SIGNUP,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Merchant']
    }),
    updateMerchant: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.MERCHANT_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Merchant', { type: 'Merchant', id }]
    }),
    deleteMerchant: builder.mutation({
      query: (payload) => ({
        url: endPoints.MERCHANT,
        method: 'DELETE',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Merchant']
    }),
    getGroceries: builder.query({
      query: ({ page = 1, limit = 10, status = 'pending', categoryId = '' } = {}) => ({
        url: endPoints.GROCERIES,
        method: 'GET',
        params: { page, limit, status, categoryId },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Merchant']
    }),
    approveMerchant: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.MERCHANT_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Merchant', { type: 'Merchant', id }]
    }),
    rejectMerchant: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.MERCHANT_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      // Only invalidate the list, not the specific merchant to avoid 404 refetch
      invalidatesTags: ['Merchant']
    })
  })
});

export const {
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useAddMerchantMutation,
  useUpdateMerchantMutation,
  useDeleteMerchantMutation,
  useGetGroceriesQuery,
  useApproveMerchantMutation,
  useRejectMerchantMutation
} = merchantApi;
