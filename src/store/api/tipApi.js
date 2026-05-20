import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const tipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTips: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: endPoints.TIP,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Tip'],
      transformResponse: (response) => response.data || response
    }),
    getTipById: builder.query({
      query: (id) => ({
        url: `${endPoints.TIP}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Tip', id }]
    }),
    createTip: builder.mutation({
      query: (payload) => ({
        url: endPoints.TIP,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Tip']
    }),
    updateTip: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.TIP}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Tip', { type: 'Tip', id }]
    }),
    deleteTip: builder.mutation({
      query: (id) => ({
        url: `${endPoints.TIP}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Tip']
    })
  })
});

export const { useGetTipsQuery, useGetTipByIdQuery, useCreateTipMutation, useUpdateTipMutation, useDeleteTipMutation } = tipApi;
