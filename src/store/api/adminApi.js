import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';
import { setCredentials } from '../slices/authSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logoutAdmin: builder.mutation({
      query: () => ({
        url: endPoints.LOGOUT,
        method: 'POST',
        showSuccessToast: false,
        showErrorToast: false
      })
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: endPoints.LOGIN,
        method: 'POST',
        data: credentials,
        showSuccessToast: true,
        showErrorToast: true
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === 'success') {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.token
              })
            );
          }
        } catch {
          // credentials dispatch is optional
        }
      },
      invalidatesTags: ['Admin']
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: endPoints.FORGOT_PASSWORD,
        method: 'POST',
        data,
        showSuccessToast: true,
        showErrorToast: true
      })
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: endPoints.VERIFY_OTP,
        method: 'POST',
        data,
        showSuccessToast: true,
        showErrorToast: true
      })
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: endPoints.REQUEST_OTP,
        method: 'POST',
        data,
        showSuccessToast: true,
        showErrorToast: true
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: endPoints.CHANGE_PASSWORD,
        method: 'POST',
        data,
        showSuccessToast: true,
        showErrorToast: true
      })
    }),
    getProfile: builder.query({
      query: () => ({
        url: endPoints.PROFILE,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Admin']
    }),
    getAdminById: builder.query({
      query: (id) => ({
        url: endPoints.PROFILE_BY_ID(id),
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Admin', id }]
    })
  })
});

export const {
  useLogoutAdminMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useGetAdminByIdQuery
} = adminApi;
