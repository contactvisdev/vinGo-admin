import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: endPoints.CUSTOMER,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Customer']
    }),
    getCustomerById: builder.query({
      query: (id) => ({
        url: endPoints.CUSTOMER_BY_ID(id),
        method: 'GET',
        showErrorToast: true
      }),
      providesTags: (result, error, id) => [{ type: 'Customer', id }]
    }),
    addCustomer: builder.mutation({
      query: (payload) => ({
        url: endPoints.ADD_CUSTOMER,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Customer']
    }),
    updateCustomer: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.CUSTOMER_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Customer', { type: 'Customer', id }]
    }),
    deleteCustomer: builder.mutation({
      query: (payload) => ({
        url: endPoints.CUSTOMER,
        method: 'DELETE',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Customer']
    })
  })
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation
} = customerApi;
