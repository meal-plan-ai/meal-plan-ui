import { User } from "./auth.types";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface NewPasswordRequestDto {
  token: string;
  password: string;
}

export interface SocialLoginRequestDto {
  token: string;
  provider: string;
}

// Response DTOs
export interface LoginResponseDto {
  user: User;
  token?: string;
}

export interface RegisterResponseDto {
  user: User;
  token?: string;
}

export interface ResetPasswordResponseDto {
  success: boolean;
  message: string;
}

export interface NewPasswordResponseDto {
  success: boolean;
  message: string;
}

export interface SocialLoginResponseDto {
  user: User;
  token?: string;
}

export type UserResponseDto = User | null

export interface LogoutResponseDto {
  success: boolean;
}

