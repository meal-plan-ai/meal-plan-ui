import { useMutation, useQuery } from '@tanstack/react-query';
import {
  // Request DTOs
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  NewPasswordRequestDto,
  SocialLoginRequestDto,

  // Response DTOs
  UserResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
  LogoutResponseDto,
  ResetPasswordResponseDto,
  NewPasswordResponseDto,
  SocialLoginResponseDto,
} from '@/api/query/auth/auth.dto';

// Query keys for caching and invalidation
export const authKeys = {
  me: ['auth', 'me'] as const,
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
  logout: ['auth', 'logout'] as const,
  resetPassword: ['auth', 'reset-password'] as const,
  newPassword: ['auth', 'new-password'] as const,
  googleLogin: ['auth', 'google'] as const,
  appleLogin: ['auth', 'apple'] as const,
};

// Auth API client
const authApi = {
  // User profile
  getCurrentUser: async (): Promise<UserResponseDto | null> => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'getCurrentUser failed');
    }

    return await response.json();

  },

  // Authentication
  login: async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  register: async (userData: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  logout: async (): Promise<LogoutResponseDto> => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    return response.json();
  },

  // Password management
  resetPassword: async (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Password reset failed');
    }

    return response.json();
  },

  setNewPassword: async (data: NewPasswordRequestDto): Promise<NewPasswordResponseDto> => {
    const response = await fetch('/api/auth/new-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Setting new password failed');
    }

    return response.json();
  },

  // Social login
  googleLogin: async (data: SocialLoginRequestDto): Promise<SocialLoginResponseDto> => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Google login failed');
    }

    return response.json();
  },

  appleLogin: async (data: SocialLoginRequestDto): Promise<SocialLoginResponseDto> => {
    const response = await fetch('/api/auth/apple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Apple login failed');
    }

    return response.json();
  },
};

// Query hooks for components
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getCurrentUser,
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: authKeys.login,
    mutationFn: authApi.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationKey: authKeys.register,
    mutationFn: authApi.register,
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: authKeys.logout,
    mutationFn: authApi.logout,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: authKeys.resetPassword,
    mutationFn: authApi.resetPassword,
  });
}

export function useNewPassword() {
  return useMutation({
    mutationKey: authKeys.newPassword,
    mutationFn: authApi.setNewPassword,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationKey: authKeys.googleLogin,
    mutationFn: authApi.googleLogin,
  });
}

export function useAppleLogin() {
  return useMutation({
    mutationKey: authKeys.appleLogin,
    mutationFn: authApi.appleLogin,
  });
} 