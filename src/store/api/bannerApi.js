import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: ({ page = 1, limit = 10, status = 'active' } = {}) => ({
        url: endPoints.BANNER_ALL,
        method: 'GET',
        params: { page, limit, status },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['Banner'],
      transformResponse: (response) => response.data || response
    }),
    getBannerById: builder.query({
      query: (id) => ({
        url: `${endPoints.BANNER}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'Banner', id }]
    }),
    createBanner: builder.mutation({
      query: (payload) => ({
        url: endPoints.BANNER,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Banner']
    }),
    updateBanner: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.BANNER}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['Banner', { type: 'Banner', id }]
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${endPoints.BANNER}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Banner']
    }),
    reorderBanners: builder.mutation({
      query: (banners) => ({
        url: endPoints.BANNER_REORDER,
        method: 'POST',
        data: { banners },
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['Banner']
    })
  })
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useReorderBannersMutation
} = bannerApi;
