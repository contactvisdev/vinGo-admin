import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10, categoryId } = {}) => ({
        url: endPoints.ORDER,
        method: 'GET',
        params: { page, limit, categoryId },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Order']
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: endPoints.ORDER_BY_ID(id),
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),
    updateOrder: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.ORDER_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Order', { type: 'Order', id }]
    }),
    deleteOrder: builder.mutation({
      query: (payload) => ({
        url: endPoints.ORDER,
        method: 'DELETE',
        data: payload
      }),
      invalidatesTags: ['Order']
    })
  })
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useUpdateOrderMutation, useDeleteOrderMutation } = orderApi;
