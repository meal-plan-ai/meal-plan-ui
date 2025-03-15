'use server';

import { apiClient } from '../client/api.client';
import {
  LoginCredentials,
  LoginResponse,
  SocialLoginCredentials,
  User,
  ResetPasswordCredentials,
  NewPasswordCredentials,
} from '../types/auth.types';
import { cookies } from 'next/headers';

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Failed to login');
  }
}

export async function googleLogin(credentials: SocialLoginCredentials): Promise<User> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/google', credentials);
    return response.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error('Failed to login with Google');
  }
}

export async function appleLogin(credentials: SocialLoginCredentials): Promise<User> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/apple', credentials);
    return response.user;
  } catch (error) {
    console.error('Apple login error:', error);
    throw new Error('Failed to login with Apple');
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout', {});
    cookies().delete('token'); // Clear the httpOnly cookie
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const user = await apiClient.get<User>('/auth/me');
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function resetPassword(data: ResetPasswordCredentials): Promise<void> {
  try {
    await apiClient.post('/auth/reset-password', data);
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error('Failed to reset password');
  }
}

export async function setNewPassword(data: NewPasswordCredentials): Promise<void> {
  try {
    await apiClient.post('/auth/new-password', data);
  } catch (error) {
    console.error('Set new password error:', error);
    throw new Error('Failed to set new password');
  }
} 