import {
  ISubscription,
  PurchaseSubscriptionResponseDto as ServerPurchaseSubscriptionResponseDto,
} from '@/api/nest-server-api/subscription/subscription.types';

export interface ResponseSubscriptionDto {
  hasActiveSubscription: boolean;
  subscription?: ISubscription;
}

export interface PurchaseSubscriptionDto {
  planId: string;
  paymentMethodId: string;
  currency?: string;
  autoRenew?: boolean;
  metadata?: Record<string, any>;
  provider?: string;
}

export type PurchaseSubscriptionResponse = ServerPurchaseSubscriptionResponseDto;
