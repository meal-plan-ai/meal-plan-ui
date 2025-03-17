import { useLogin, useLogout } from '@/api/query/auth/auth.query';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/api/query/auth/auth.query';
import type { LoginRequestDto } from '@/api/query/auth/auth.dto';

export function useLoginWithRedirect() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useLogin();

  return {
    ...login,
    async mutateAsync(credentials: LoginRequestDto) {
      try {
        const result = await login.mutateAsync(credentials);
        await queryClient.invalidateQueries({ queryKey: authKeys.me });
        router.push('/cabinet');
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    }
  };
}

export function useLogoutWithRedirect() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useLogout();

  return {
    ...logout,
    async mutateAsync() {
      try {
        const result = await logout.mutateAsync();
        queryClient.clear();
        router.push('/auth/login');
        return result;
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    }
  };
} 