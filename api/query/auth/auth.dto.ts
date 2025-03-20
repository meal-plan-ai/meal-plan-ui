export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean
}

export interface LogoutResponseDto {
  success: boolean
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
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
