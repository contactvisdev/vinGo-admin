import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: ({ page = 1, limit = 10, status, minimumAmount } = {}) => ({
        url: endPoints.COUPON,
        method: 'GET',
        params: { page, limit, status, minimumAmount },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Coupon'],
      transformResponse: (response) => response.data || response
    }),
    getCouponById: builder.query({
      query: (id) => ({
        url: `${endPoints.COUPON}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Coupon', id }]
    }),
    createCoupon: builder.mutation({
      query: (payload) => ({
        url: endPoints.COUPON,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Coupon']
    }),
    updateCoupon: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.COUPON}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Coupon', { type: 'Coupon', id }]
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${endPoints.COUPON}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Coupon']
    })
  })
});

export const { useGetCouponsQuery, useGetCouponByIdQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } =
  couponApi;
