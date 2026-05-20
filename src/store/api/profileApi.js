import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: endPoints.PROFILE,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Profile']
    }),
    updateProfile: builder.mutation({
      query: ({ id, payload }) => ({
        url: endPoints.PROFILE_BY_ID(id),
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Profile', { type: 'Profile', id }]
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: endPoints.CHANGE_PASSWORD,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      })
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `admins/users/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Profile', id }]
    })
  })
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useGetUserByIdQuery } = profileApi;
