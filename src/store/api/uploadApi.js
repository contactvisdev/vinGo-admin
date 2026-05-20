import { apiSlice } from '../apiSlice';
import endPoints from '../../services/endpoints';

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingleFile: builder.mutation({
      query: (arg) => {
        let formData;
        if (arg instanceof FormData) {
          formData = arg;
        } else {
          formData = new FormData();
          formData.append('file', arg);
        }
        return {
          url: endPoints.UPLOAD_SINGLE,
          method: 'POST',
          data: formData,
          showSuccessToast: false,
          showErrorToast: true
        };
      }
    })
  })
});

export const { useUploadSingleFileMutation } = uploadApi;
