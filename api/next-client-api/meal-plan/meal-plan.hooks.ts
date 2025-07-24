import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nextClientMealPlanApi } from './meal-plan.query';
import { AiGenerationStatus } from '@/api/nest-server-api/meal-plan/meal-plan.types';

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
    // Poll every 3 seconds if generation is in progress
    refetchInterval: query => {
      const mealPlan = query.state.data;
      return mealPlan?.aiGenerationStatus === AiGenerationStatus.IN_PROGRESS ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await nextClientMealPlanApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.userPlans() });
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
    },
  });
}

export function useGenerateAiPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await nextClientMealPlanApi.generateAiPlan(id);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch the specific meal plan to get updated status
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.userPlans() });
    },
  });
}
