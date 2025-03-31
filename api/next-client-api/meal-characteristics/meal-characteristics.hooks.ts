import { useMutation, useQuery } from '@tanstack/react-query';
import { nextClientMealCharacteristicsApi } from './meal-characteristics.query';

export const mealCharacteristicsKeys = {
  all: ['meal-characteristics'] as const,
  lists: () => [...mealCharacteristicsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...mealCharacteristicsKeys.lists(), filters] as const,
  details: () => [...mealCharacteristicsKeys.all, 'detail'] as const,
  detail: (id: string) => [...mealCharacteristicsKeys.details(), id] as const,
};

export function useMealCharacteristics(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: mealCharacteristicsKeys.list({ page, limit }),
    queryFn: async () => {
      const { data } = await nextClientMealCharacteristicsApi.getAll(page, limit);
      return data;
    },
  });
}

export function useMealCharacteristic(id: string) {
  return useQuery({
    queryKey: mealCharacteristicsKeys.detail(id),
    queryFn: async () => {
      const { data } = await nextClientMealCharacteristicsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useDeleteMealCharacteristic() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await nextClientMealCharacteristicsApi.delete(id);
      return response.data;
    },
  });
}
