import { AxiosRequestConfig } from 'axios';

export interface ISignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ISignInResponse {
  exp: number;
  token: string;
}

export interface ISignUpRequest {
  email: string;
  password: string;
}

export interface ISendVerificationEmailRequest {
  email: string;
}

export interface IVerifyEmailRequest {
  email: string;
  token: string;
}

export interface IVerifyEmailResponse {
  token: string;
  exp: number;
}

export interface CustomAuthRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponseDto {
  success: boolean;
}

export interface NewPasswordRequestDto {
  currentPassword: string;
  password: string;
}

export interface NewPasswordResponseDto {
  success: boolean;
}

export interface LogoutResponseDto {
  success: boolean;
}
