import axios from 'axios';

interface EnhancedError extends Error {
  originalError: unknown;
  status?: number;
  data?: Record<string, unknown>;
}

const BASE_URL = '/api';

const nextClientApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

nextClientApiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;

      if (!pathname.startsWith('/auth/')) {
        window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`;
        return new Promise(() => {});
      }
    }

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    const enhancedError = new Error(errorMessage) as EnhancedError;

    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export default nextClientApiClient;
