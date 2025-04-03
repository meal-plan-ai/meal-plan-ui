import { useMutation, useQuery } from '@tanstack/react-query';
import { nextClientMealPlanApi } from './meal-plan.query';

export const mealPlanKeys = {
  all: ['meal-plan'] as const,
  lists: () => [...mealPlanKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...mealPlanKeys.lists(), filters] as const,
  userPlans: () => [...mealPlanKeys.all, 'user-plans'] as const,
  details: () => [...mealPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...mealPlanKeys.details(), id] as const,
};

export function useMealPlans(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: mealPlanKeys.list({ page, limit }),
    queryFn: async () => {
      const { data } = await nextClientMealPlanApi.getAll(page, limit);
      return data;
    },
  });
}

export function useUserMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.userPlans(),
    queryFn: async () => {
      const { data } = await nextClientMealPlanApi.getUserPlans();
      return data;
    },
  });
}

export function useMealPlan(id: string) {
  return useQuery({
    queryKey: mealPlanKeys.detail(id),
    queryFn: async () => {
      const {
        data: { data },
      } = await nextClientMealPlanApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useDeleteMealPlan() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await nextClientMealPlanApi.delete(id);
      return response.data;
    },
  });
}
