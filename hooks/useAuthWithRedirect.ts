import { useLogin, useLogout, useRegister } from '@/api/query/auth/auth.query';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { LoginRequestDto, RegisterRequestDto } from '@/api/query/auth/auth.dto';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useLoginWithRedirect() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useLogin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
    ...login,
    errorMessage,
    async mutateAsync(credentials: LoginRequestDto) {
      try {
        setErrorMessage(null);
        const result = await login.mutateAsync(credentials);

        queryClient.invalidateQueries();

        router.push('/cabinet');
        toast.success('Login successful');
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setErrorMessage(message);
        toast.error(message);
      }
    },
  };
}

export function useRegisterWithRedirect() {
  const register = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
    ...register,
    errorMessage,
    async mutateAsync(userData: RegisterRequestDto) {
      try {
        setErrorMessage(null);
        const result = await register.mutateAsync(userData);
        toast.success('Registration successful!');
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        setErrorMessage(message);
        toast.error(message);
      }
    },
  };
}

export function useLogoutWithRedirect() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useLogout();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
    ...logout,
    errorMessage,
    async mutateAsync() {
      try {
        const result = await logout.mutateAsync();

        queryClient.resetQueries();

        const authRelatedKeys = ['user', 'auth', 'session', 'token'];
        authRelatedKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });

        router.refresh();

        router.push('/auth/login');
        toast.success('Logout successful');
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Logout failed';
        setErrorMessage(message);
        toast.error(message);
      }
    },
  };
}
