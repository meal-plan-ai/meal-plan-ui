import { useQuery, useMutation } from '@tanstack/react-query';
import { nextClientUsersApi } from './users.query';
import { ChangePasswordDto } from './users.dto';

export const usersKeys = {
  all: ['users'] as const,
  details: (id: string) => ['users', id] as const,
  currentUser: ['users', 'current-user'] as const,
  getUserSubscription: ['users', 'get-subscription-status'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: usersKeys.currentUser,
    queryFn: async () => {
      const { data } = await nextClientUsersApi.getCurrentUser();
      return data;
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

export function useGetUserSubscription() {
  return useQuery({
    queryKey: usersKeys.getUserSubscription,
    queryFn: async () => {
      const { data } = await nextClientUsersApi.getUserSubscription();
      return data;
    },
  });
}
