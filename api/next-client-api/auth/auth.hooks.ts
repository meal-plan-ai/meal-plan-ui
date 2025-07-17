import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { nextClientAuthApi } from './auth.query';

export const authKeys = {
  logout: ['auth', 'logout'] as const,
};

// Utility hook to clear auth-related cache
export function useClearAuthCache() {
  const queryClient = useQueryClient();

  return () => {
    // Clear all cached data
    queryClient.clear();

    // Invalidate specific user-related queries
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearAuthCache = useClearAuthCache();

  return useMutation({
    mutationFn: nextClientAuthApi.logout,
    onSuccess: () => {
      // Clear auth cache
      clearAuthCache();

      // Redirect to login page
      router.push('/auth/login');
    },
    onError: error => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local cache and redirect
      clearAuthCache();
      router.push('/auth/login');
    },
  });
}
