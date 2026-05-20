import axios from 'axios';
import { logout } from '../store/slices/authSlice';
import { showToastAction } from '../store/slices/commonSlice';

const REQUEST_TIMEOUT_MS = 30000;

// CSRF note: withCredentials is false and auth uses Bearer tokens in headers (not cookies).
// This means CSRF attacks cannot forge authenticated requests. If auth is ever migrated
// to cookie-based tokens, CSRF protection (SameSite + token) must be added.
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  timeout: REQUEST_TIMEOUT_MS
});

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const TIMEOUT_ERROR = 'Request timed out. Please check your connection.';
const NETWORK_ERROR = 'Network error. Please check your connection.';

const sanitizeErrorMessage = (rawMessage, error) => {
  if (error.code === 'ECONNABORTED') return TIMEOUT_ERROR;
  if (!error.response) return NETWORK_ERROR;

  // Only surface short, readable backend messages (no stack traces or internal paths)
  if (typeof rawMessage === 'string' && rawMessage.length > 0 && rawMessage.length <= 200 && !rawMessage.includes('\n')) {
    return rawMessage;
  }

  return GENERIC_ERROR;
};

export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      const showSuccessToast = response.config?.showSuccessToast === true;

      if (showSuccessToast && response.data?.message) {
        store.dispatch(
          showToastAction({
            type: 'success',
            title: response.data.message
          })
        );
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const showErrorToast = originalRequest?.showErrorToast === true;

      if (error.response?.status === 401 || error.response?.status === 402) {
        store.dispatch(
          showToastAction({
            type: 'error',
            title: 'Session expired. Please login again.'
          })
        );
        store.dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userData');
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (showErrorToast) {
        const rawMessage = error.response?.data?.message || error.response?.data?.error || '';
        const errorMessage = sanitizeErrorMessage(rawMessage, error);

        store.dispatch(
          showToastAction({
            type: 'error',
            title: errorMessage
          })
        );
      }

      return Promise.reject(error);
    }
  );
};

const api = async (method, urlEndPoint, data = {}, params = {}, contentType = 'application/json') => {
  try {
    const response = await axiosInstance({
      method,
      url: urlEndPoint,
      data,
      params,
      headers: { 'Content-Type': contentType }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export { axiosInstance };
export default api;
