import { useQuery, useMutation } from '@tanstack/react-query';
import { ChangePasswordDto, ChangePasswordResponseDto } from './users.dto';
import { IUser } from './users.types';

export const usersKeys = {
  all: ['users'] as const,
  details: (id: string) => ['users', id] as const,
  currentUser: ['users', 'current-user'] as const,
};

const usersApi = {
  getCurrentUser: async (): Promise<IUser | null> => {
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      const error = await response.json();
      throw new Error(error.error || 'getCurrentUser failed');
    }

    return await response.json();
  },

  changePassword: async (data: ChangePasswordDto): Promise<ChangePasswordResponseDto> => {
    const response = await fetch('/api/auth/new-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  },
};

export function useCurrentUser() {
  return useQuery({
    queryKey: usersKeys.currentUser,
    queryFn: usersApi.getCurrentUser,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersApi.changePassword,
  });
}