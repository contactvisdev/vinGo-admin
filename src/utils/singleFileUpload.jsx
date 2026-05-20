import { uploadApi } from '../store/api/uploadApi';

export const singleFileUpload =
  ({ fieldName, setValue, dispatch, setLocalFile, setLoading, imageOnly = false, setErrorMessage, trigger, clearErrors }) =>
  async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // --- SIZE VALIDATION ---
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage?.('File size must be less than 4MB.');
      e.target.value = '';
      return;
    }

    // --- IMAGE-ONLY VALIDATION ---
    if (imageOnly) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/x-icon', 'image/tiff'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage?.('Only image files (JPG, PNG, GIF, WebP, BMP, ICO, TIFF) are allowed.');
        e.target.value = '';
        return;
      }
    }

    setErrorMessage?.('');
    clearErrors?.(fieldName);
    setLocalFile?.(file);
    setValue(fieldName, file, { shouldValidate: false });

    try {
      setLoading?.(true);

      const formData = new FormData();
      formData.append('file', file);

      const { axiosInstance } = await import('../services/api');
      const endPoints = (await import('../services/endpoints')).default;

      const response = await axiosInstance.post(endPoints.UPLOAD_SINGLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = response.data;

      if (result) {
        const fileUrl = result?.data?.url || result?.url;
        setValue(fieldName, fileUrl, { shouldValidate: true, shouldDirty: true });
        clearErrors?.(fieldName);
        trigger?.(fieldName);
      }
    } catch (error) {
      console.error('File upload failed', error);
      setErrorMessage?.(error?.message || 'File upload failed');
    } finally {
      setLoading?.(false);
    }
  };
