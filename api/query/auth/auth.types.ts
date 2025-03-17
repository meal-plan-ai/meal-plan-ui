
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface SocialLoginCredentials {
  token: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface NewPasswordCredentials {
  token: string;
  password: string;
  confirmPassword: string;
} 