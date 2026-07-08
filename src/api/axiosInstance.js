import axios from 'axios';
import mockAdapter from './mockAdapter';
import { API_TIMEOUT_MS } from '../constants/theme';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: mockAdapter,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token') || 'demo-token';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        error.message = 'Unauthorized access. Please re-authenticate.';
      } else if (status === 403) {
        error.message = 'Forbidden access. Contact your administrator.';
      } else if (status >= 500) {
        error.message = 'Server error. Please try again later.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Check your connection and try again.';
    } else {
      error.message = 'Network error. Please verify your internet connection.';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
