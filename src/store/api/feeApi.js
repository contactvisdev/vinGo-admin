import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const feeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: ({ page = 1, limit = 10, showErrorToast = true } = {}) => ({
        url: endPoints.FEE,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Fee'],
      transformResponse: (response) => response.data || response
    }),
    getFeeById: builder.query({
      query: (id) => ({
        url: `${endPoints.FEE}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Fee', id }]
    }),
    createFee: builder.mutation({
      query: ({ payload, showSuccessToast = true, showErrorToast = true }) => ({
        url: endPoints.FEE,
        method: 'POST',
        data: payload,
        showSuccessToast,
        showErrorToast
      }),
      invalidatesTags: ['Fee']
    }),
    updateFee: builder.mutation({
      query: ({ id, payload, showSuccessToast = true, showErrorToast = true }) => ({
        url: `${endPoints.FEE}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast,
        showErrorToast
      }),
      invalidatesTags: (result, error, { id }) => ['Fee', { type: 'Fee', id }]
    }),
    deleteFee: builder.mutation({
      query: ({ id, showSuccessToast = true, showErrorToast = true }) => ({
        url: `${endPoints.FEE}/${id}`,
        method: 'DELETE',
        showSuccessToast,
        showErrorToast
      }),
      invalidatesTags: ['Fee']
    })
  })
});

export const { useGetFeesQuery, useGetFeeByIdQuery, useCreateFeeMutation, useUpdateFeeMutation, useDeleteFeeMutation } = feeApi;
