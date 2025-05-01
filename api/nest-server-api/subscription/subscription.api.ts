import { nestServerApiClient } from '../nestServerApiClient';
import { AxiosResponse } from 'axios';
import { NEST_SERVER_SUBSCRIPTION_ENDPOINTS } from './subscription.constants';
import {
  PurchaseSubscriptionDto,
  PurchaseSubscriptionResponseDto,
  SubscriptionResponseDto,
} from './subscription.types';

export const nestServerSubscriptionApi = {
  getUserSubscriptionStatus: (): Promise<AxiosResponse<SubscriptionResponseDto>> => {
    return nestServerApiClient.get<SubscriptionResponseDto>(
      NEST_SERVER_SUBSCRIPTION_ENDPOINTS.GET_USER_SUBSCRIPTION
    );
  },

  purchaseSubscription: (
    data: PurchaseSubscriptionDto
  ): Promise<AxiosResponse<PurchaseSubscriptionResponseDto>> => {
    console.log('data', data);
    return nestServerApiClient.post<PurchaseSubscriptionResponseDto>(
      NEST_SERVER_SUBSCRIPTION_ENDPOINTS.PURCHASE_SUBSCRIPTION,
      data
    );
  },
};
