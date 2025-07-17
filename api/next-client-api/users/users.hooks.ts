import { useQuery, useMutation } from '@tanstack/react-query';
import { nextClientUsersApi } from './users.query';
import { ChangePasswordDto } from './users.dto';

export const usersKeys = {
  all: ['users'] as const,
  details: (id: string) => ['users', id] as const,
  currentUser: ['users', 'current-user'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: usersKeys.currentUser,
    queryFn: async () => {
      try {
        const { data } = await nextClientUsersApi.getCurrentUser();
        return data;
      } catch (error: any) {
        // If 401 error, the interceptor will handle redirect
        // Return null so ProtectedRoute redirects appropriately
        if (error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordDto) => {
      const { data } = await nextClientUsersApi.changePassword(passwordData);
      return data;
    },
  });
}
