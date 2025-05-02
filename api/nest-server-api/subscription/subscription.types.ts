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

export interface SubscriptionResponseDto {
  hasActiveSubscription: boolean;
  subscription?: ISubscription;
}

export interface PurchaseSubscriptionDto {
  planId: string;
  paymentMethodId: string;
  currency?: string;
  autoRenew?: boolean;
  metadata?: Record<string, any>;
}

export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
}

export interface PurchaseSubscriptionResponseDto {
  subscription: ISubscription;
  payment: IPayment;
}
