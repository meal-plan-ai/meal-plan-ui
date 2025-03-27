import { useMutation } from '@tanstack/react-query';
import {
  LoginRequestDto,
  RegisterRequestDto,
  NewPasswordRequestDto,
  LoginResponseDto,
  RegisterResponseDto,
  LogoutResponseDto,
  NewPasswordResponseDto,
} from './auth.dto';

export const authKeys = {
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
  logout: ['auth', 'logout'] as const,
  newPassword: ['auth', 'new-password'] as const,
};

const authApi = {
  login: async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return await response.json();
  },

  logout: async (): Promise<LogoutResponseDto> => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Logout failed');
    }

    return response.json();
  },

  register: async (userData: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return response.json();
  },

  setNewPassword: async (data: NewPasswordRequestDto): Promise<NewPasswordResponseDto> => {
    const response = await fetch('/api/auth/new-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Setting new password failed');
    }

    return response.json();
  },
};

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
  });
}

export function useNewPassword() {
  return useMutation({
    mutationFn: authApi.setNewPassword,
  });
}
