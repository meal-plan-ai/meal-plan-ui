export interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

export interface UserResponseDto extends UserBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUserResponseDto extends UserResponseDto {
  isEmailVerified: boolean;
}

export interface PaginatedUsersResponseDto {
  items: UserResponseDto[];
  totalItems: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
