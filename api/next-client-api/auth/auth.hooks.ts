import { useMutation } from '@tanstack/react-query';
import { nextClientAuthApi } from './auth.query';

export const authKeys = {
  logout: ['auth', 'logout'] as const,
};

export function useLogout() {
  return useMutation({
    mutationFn: nextClientAuthApi.logout,
  });
}
