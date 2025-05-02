import { useMutation, useQuery } from '@tanstack/react-query';
import { nextClientSubscriptionApi } from './subscription.query';
import { PurchaseSubscriptionDto, PurchaseSubscriptionResponse } from './subscription.types';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  getUserSubscriptionStatus: ['subscriptionStatus', 'get-subscription-status'] as const,
  purchaseSubscription: ['subscription', 'purchase'] as const,
};

export function useGetUserSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.getUserSubscriptionStatus,
    queryFn: async () => {
      const { data } = await nextClientSubscriptionApi.getUserSubscriptionStatus();
      return data;
    },
  });
}

export function usePurchaseSubscription() {
  return useMutation({
    mutationKey: subscriptionKeys.purchaseSubscription,
    mutationFn: async (data: PurchaseSubscriptionDto): Promise<PurchaseSubscriptionResponse> => {
      const { data: responseData } = await nextClientSubscriptionApi.purchaseSubscription(data);
      return responseData;
    },
  });
}
