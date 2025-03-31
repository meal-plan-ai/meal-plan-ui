export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
  [key: string]: unknown;
}

export interface ProfileBase {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
}

export interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
}

export interface ProfileResponseDto extends ProfileBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
