import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const foodTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoodTypes: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: endPoints.FOOD_TYPE,
        method: 'GET',
        params: { page, limit },
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: ['FoodType'],
      transformResponse: (response) => response.data || response
    }),
    getFoodTypeById: builder.query({
      query: (id) => ({
        url: `${endPoints.FOOD_TYPE}/${id}`,
        method: 'GET',
        showErrorToast: true,
        showSuccessToast: false
      }),
      providesTags: (result, error, id) => [{ type: 'FoodType', id }]
    }),
    createFoodType: builder.mutation({
      query: (payload) => ({
        url: endPoints.FOOD_TYPE,
        method: 'POST',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['FoodType']
    }),
    updateFoodType: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.FOOD_TYPE}/${id}`,
        method: 'PUT',
        data: payload,
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: (result, error, { id }) => ['FoodType', { type: 'FoodType', id }]
    }),
    deleteFoodType: builder.mutation({
      query: (id) => ({
        url: `${endPoints.FOOD_TYPE}/${id}`,
        method: 'DELETE',
        showSuccessToast: true,
        showErrorToast: true
      }),
      invalidatesTags: ['FoodType']
    })
  })
});

export const {
  useGetFoodTypesQuery,
  useGetFoodTypeByIdQuery,
  useCreateFoodTypeMutation,
  useUpdateFoodTypeMutation,
  useDeleteFoodTypeMutation
} = foodTypeApi;
