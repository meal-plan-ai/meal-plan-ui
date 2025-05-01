import { AxiosResponse } from 'axios';
import { nextClientApiClient } from '../nextClientApiClient';
import { NEXT_CLIENT_SUBSCRIPTION_ENDPOINTS } from './subscription.constants';
import {
  PurchaseSubscriptionDto,
  PurchaseSubscriptionResponse,
  ResponseSubscriptionDto,
} from './subscription.types';

export const nextClientSubscriptionApi = {
  getUserSubscriptionStatus: (): Promise<AxiosResponse<ResponseSubscriptionDto>> => {
    return nextClientApiClient.get<ResponseSubscriptionDto>(
      NEXT_CLIENT_SUBSCRIPTION_ENDPOINTS.GET_USER_SUBSCRIPTION
    );
  },

  purchaseSubscription: (
    data: PurchaseSubscriptionDto
  ): Promise<AxiosResponse<PurchaseSubscriptionResponse>> => {
    return nextClientApiClient.post<PurchaseSubscriptionResponse>(
      NEXT_CLIENT_SUBSCRIPTION_ENDPOINTS.PURCHASE_SUBSCRIPTION,
      data
    );
  },
};
