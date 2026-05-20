import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '../services/api';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers, showSuccessToast, showErrorToast }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        showSuccessToast,
        showErrorToast
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: ''
  }),
  tagTypes: [
    'Admin',
    'Customer',
    'Merchant',
    'Driver',
    'Category',
    'Order',
    'FoodType',
    'Fee',
    'Coupon',
    'Profile',
    'BusinessStaff',
    'Banner',
    'ProductType',
    'StoreType',
    'TermsPolicy'
  ],
  keepUnusedDataFor: 60,
  endpoints: () => ({})
});
