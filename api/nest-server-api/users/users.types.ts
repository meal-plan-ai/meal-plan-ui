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

export enum ESubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

export interface ISubscription {
  id: string;
  userId: string;
  planId: string;
  status: ESubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  plan?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
}

export interface ResponseSubscriptionDto {
  hasActiveSubscription: boolean;
  subscription?: ISubscription;
}

export interface SubscriptionResponseDto {
  hasActiveSubscription: boolean;
  subscription?: ISubscription;
}
