import { UserProfileResponseDto } from '../profile/profile.dto';

// Use ProfileResponseDto for User type to maintain consistency
export type User = UserProfileResponseDto;

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword: string;
}
