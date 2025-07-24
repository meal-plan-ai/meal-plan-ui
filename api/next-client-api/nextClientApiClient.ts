import axios from 'axios';
import toast from 'react-hot-toast';
import { IResponseError } from '../api.types';

interface EnhancedError extends Error {
  originalError: unknown;
  status?: number;
  data?: Record<string, unknown>;
}

// Global auth error handler
let globalQueryClient: any = null;

export const setGlobalQueryClient = (queryClient: any) => {
  globalQueryClient = queryClient;
};

const handleAuthError = () => {
  // Clear React Query cache if available
  if (globalQueryClient) {
    globalQueryClient.clear();
    globalQueryClient.invalidateQueries({ queryKey: ['users'] });
    globalQueryClient.invalidateQueries({ queryKey: ['profile'] });
  }

  const pathname = window.location.pathname;
  if (!pathname.startsWith('/auth/')) {
    window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`;
  }
};

const BASE_URL = process.env.NEXT_PUBLIC_NEXT_API_URL || 'http://localhost:3001/api';

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
      handleAuthError();
      return new Promise(() => {});
    }

    const errorData = error.response?.data as IResponseError;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Show toast for different error types
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(`Bad Request: ${errorMessage}`);
          break;
        case 403:
          toast.error(`Access Denied: ${errorMessage}`);
          break;
        case 404:
          toast.error(`Not Found: ${errorMessage}`);
          break;
        case 409:
          toast.error(errorMessage);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(errorMessage);
      }
    } else {
      toast.error(errorMessage);
    }

    const enhancedError = new Error(errorMessage) as EnhancedError;

    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export { nextClientApiClient };
