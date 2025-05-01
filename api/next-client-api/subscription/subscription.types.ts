import { ISubscription } from '@/api/nest-server-api/users/users.types';

export interface ResponseSubscriptionDto {
  hasActiveSubscription: boolean;
  subscription?: ISubscription;
}
