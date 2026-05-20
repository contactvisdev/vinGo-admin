import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: endPoints.DRIVER_GET,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Driver']
    }),
    getDriverById: builder.query({
      query: (id) => ({
        url: endPoints.DRIVER_BY_ID(id),
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Driver', id }]
    }),
    addDriver: builder.mutation({
      query: (payload) => ({
        url: endPoints.ADD_DRIVER,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Driver']
    }),
    updateDriver: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.DRIVER_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Driver', { type: 'Driver', id }]
    }),
    deleteDriver: builder.mutation({
      query: (payload) => ({
        url: endPoints.DRIVER,
        method: 'DELETE',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Driver']
    })
  })
});

export const { useGetDriversQuery, useGetDriverByIdQuery, useAddDriverMutation, useUpdateDriverMutation, useDeleteDriverMutation } =
  driverApi;
