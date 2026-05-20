import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const termsPolicyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTermsPolicies: builder.query({
      query: (params) => ({
        url: endPoints.TERMS_POLICY,
        method: 'GET',
        params: {
          ...(params?.type ? { type: params.type } : {}),
          ...(params?.userType ? { userType: params.userType } : {})
        },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['TermsPolicy'],
      transformResponse: (response) => {
        const d = response?.data;
        return Array.isArray(d) ? d : (d?.list ?? d?.data ?? []);
      }
    }),
    getTermsPolicyById: builder.query({
      query: (id) => ({
        url: `${endPoints.TERMS_POLICY}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'TermsPolicy', id }]
    }),
    createTermsPolicy: builder.mutation({
      query: (payload) => ({
        url: endPoints.TERMS_POLICY,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['TermsPolicy']
    }),
    updateTermsPolicy: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.TERMS_POLICY}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['TermsPolicy', { type: 'TermsPolicy', id }]
    }),
    deleteTermsPolicy: builder.mutation({
      query: (id) => ({
        url: `${endPoints.TERMS_POLICY}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['TermsPolicy']
    })
  })
});

export const {
  useGetTermsPoliciesQuery,
  useGetTermsPolicyByIdQuery,
  useCreateTermsPolicyMutation,
  useUpdateTermsPolicyMutation,
  useDeleteTermsPolicyMutation
} = termsPolicyApi;
