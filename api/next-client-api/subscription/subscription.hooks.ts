import { useQuery } from '@tanstack/react-query';
import { nextClientSubscriptionApi } from './subscription.query';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  getUserSubscriptionStatus: ['subscriptionStatus', 'get-subscription-status'] as const,
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
