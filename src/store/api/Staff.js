import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const businessStaffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL STAFF
    getBusinessStaff: builder.query({
      query: (params = {}) => ({
        url: endPoints.BUSINESS_STAFF,
        method: 'GET',
        params,
        showErrorToast: true
      }),
      providesTags: ['BusinessStaff']
    }),

    // GET STAFF BY ID
    getBusinessStaffById: builder.query({
      query: (id) => ({
        url: endPoints.BUSINESS_STAFF_BY_ID(id),
        method: 'GET',
        showErrorToast: true
      }),
      providesTags: (result, error, id) => [{ type: 'BusinessStaff', id }]
    }),

    // CREATE STAFF
    createBusinessStaff: builder.mutation({
      query: (payload) => ({
        url: endPoints.BUSINESS_STAFF,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['BusinessStaff']
    }),

    // UPDATE STAFF BY ID
    updateBusinessStaff: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.BUSINESS_STAFF_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['BusinessStaff', { type: 'BusinessStaff', id }]
    }),

    // DELETE STAFF (single or multiple)
    deleteBusinessStaff: builder.mutation({
      query: (payload) => ({
        url: endPoints.BUSINESS_STAFF,
        method: 'DELETE',
        data: payload, // { id } or { ids: [] }
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['BusinessStaff']
    }),

    // EMAIL OTP
    requestEmailOtp: builder.mutation({
      query: (payload) => ({
        url: endPoints.BUSINESS_STAFF_EMAIL_OTP,
        method: 'POST',
        data: payload, // { email }
        showSuccessToast: true,
        showErrorToast: true
      })
    }),

    // MOBILE OTP
    requestMobileOtp: builder.mutation({
      query: (payload) => ({
        url: endPoints.BUSINESS_STAFF_MOBILE_OTP,
        method: 'POST',
        data: payload, // { phone }
        showSuccessToast: true,
        showErrorToast: true
      })
    }),

    // LOGIN (EMAIL OTP or PHONE OTP)
    businessStaffLogin: builder.mutation({
      query: (payload) => ({
        url: endPoints.BUSINESS_STAFF_LOGIN,
        method: 'POST',
        data: payload, // { email, otp } OR { phone, otp }
        showSuccessToast: true,
        showErrorToast: true
      })
    })
  })
});

export const {
  useGetBusinessStaffQuery,
  useGetBusinessStaffByIdQuery,
  useCreateBusinessStaffMutation,
  useUpdateBusinessStaffMutation,
  useDeleteBusinessStaffMutation,
  useRequestEmailOtpMutation,
  useRequestMobileOtpMutation,
  useBusinessStaffLoginMutation
} = businessStaffApi;
