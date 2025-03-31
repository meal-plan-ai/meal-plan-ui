import { ProfileResponseDto } from '../profile/profile.dto';

export interface UserResponseDto {
  id: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: ProfileResponseDto;
}

export interface ChangePasswordDto {
  currentPassword: string;
  password: string;
}

export interface ChangePasswordResponseDto {
  success: boolean;
}
