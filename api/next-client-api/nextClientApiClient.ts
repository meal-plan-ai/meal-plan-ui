import axios from 'axios';

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

export { nextClientApiClient };
