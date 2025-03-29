import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreateMealCharacteristicRequestDto,
  UpdateMealCharacteristicRequestDto,
  MealCharacteristicResponseDto,
  PaginatedMealCharacteristicsResponseDto,
  DeleteMealCharacteristicResponseDto,
} from './meal-characteristics.dto';

// Query keys for meal characteristics
export const mealCharacteristicsKeys = {
  all: ['meal-characteristics'] as const,
  lists: () => [...mealCharacteristicsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...mealCharacteristicsKeys.lists(), filters] as const,
  details: () => [...mealCharacteristicsKeys.all, 'detail'] as const,
  detail: (id: string) => [...mealCharacteristicsKeys.details(), id] as const,
};

// API functions for meal characteristics
const mealCharacteristicsApi = {
  // Get paginated list of meal characteristics
  getAll: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedMealCharacteristicsResponseDto> => {
    const response = await fetch(`/api/meal-characteristics?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch meal characteristics');
    }

    return await response.json();
  },

  // Get a single meal characteristic by ID
  getById: async (id: string): Promise<MealCharacteristicResponseDto> => {
    const response = await fetch(`/api/meal-characteristics/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch meal characteristic');
    }

    return await response.json();
  },

  // Create a new meal characteristic
  create: async (
    data: CreateMealCharacteristicRequestDto
  ): Promise<MealCharacteristicResponseDto> => {
    const response = await fetch('/api/meal-characteristics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create meal characteristic');
    }

    return await response.json();
  },

  // Update an existing meal characteristic
  update: async (
    id: string,
    data: UpdateMealCharacteristicRequestDto
  ): Promise<MealCharacteristicResponseDto> => {
    const response = await fetch(`/api/meal-characteristics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update meal characteristic');
    }

    return await response.json();
  },

  // Delete a meal characteristic
  delete: async (id: string): Promise<DeleteMealCharacteristicResponseDto> => {
    const response = await fetch(`/api/meal-characteristics/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete meal characteristic');
    }

    return await response.json();
  },
};

// React Query hooks for meal characteristics
export function useMealCharacteristics(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: mealCharacteristicsKeys.list({ page, limit }),
    queryFn: () => mealCharacteristicsApi.getAll(page, limit),
  });
}

export function useMealCharacteristic(id: string) {
  return useQuery({
    queryKey: mealCharacteristicsKeys.detail(id),
    queryFn: () => mealCharacteristicsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMealCharacteristic() {
  return useMutation({
    mutationFn: mealCharacteristicsApi.create,
  });
}

export function useUpdateMealCharacteristic(id: string) {
  return useMutation({
    mutationFn: (data: UpdateMealCharacteristicRequestDto) =>
      mealCharacteristicsApi.update(id, data),
  });
}

export function useDeleteMealCharacteristic() {
  return useMutation({
    mutationFn: mealCharacteristicsApi.delete,
  });
}
