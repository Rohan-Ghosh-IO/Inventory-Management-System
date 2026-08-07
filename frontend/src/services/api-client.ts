import axios from 'axios';
import toast from 'react-hot-toast';
import { ENV } from '../config/env';
import { ROUTES } from '../constants';

export const authApiClient = axios.create({
  baseURL: ENV.AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryApiClient = axios.create({
  baseURL: ENV.INVENTORY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors for an Axios instance
const setupInterceptors = (instance: typeof axios) => {
  // Request Interceptor: Automatically attach JWT token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Global 401 & error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      let message = error.response?.data?.message;

      // Parse JSON message if response was expecting blob
      if (error.response?.data instanceof Blob && error.response.data.type.includes('application/json')) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || message;
        } catch (_) {}
      }

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please log in again.');
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN;
        }
      } else if (!error.response) {
        toast.error('Network connection error. Server unreachable.');
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(authApiClient as any);
setupInterceptors(inventoryApiClient as any);
