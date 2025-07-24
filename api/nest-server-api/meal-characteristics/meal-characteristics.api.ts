import { nestServerApiClient } from '../nestServerApiClient';
import { NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS } from './meal-characteristics.constants';
import {
  INutritionProfileCharacteristic,
  INutritionProfileCharacteristicCreate,
} from './meal-characteristics.types';
import { IBaseResponse } from '@/api/api.types';

export const nestServerMealCharacteristicsApi = {
  getAll: (page = 1, limit = 10) => {
    return nestServerApiClient.get<IBaseResponse<INutritionProfileCharacteristic[]>>(
      `${NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
    );
  },

  getById: (id: INutritionProfileCharacteristic['id']) => {
    return nestServerApiClient.get<IBaseResponse<INutritionProfileCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id)
    );
  },

  create: (data: INutritionProfileCharacteristicCreate) => {
    return nestServerApiClient.post<IBaseResponse<INutritionProfileCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE,
      data
    );
  },

  update: (
    id: INutritionProfileCharacteristic['id'],
    data: Partial<INutritionProfileCharacteristic>
  ) => {
    return nestServerApiClient.patch<IBaseResponse<INutritionProfileCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id),
      data
    );
  },

  delete: (id: INutritionProfileCharacteristic['id']) => {
    return nestServerApiClient.delete<IBaseResponse<number | null | undefined>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id)
    );
  },
};
