import { IBaseResponse } from '@/api/api.types';
import { nextClientApiClient } from '../nextClientApiClient';
import { NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS } from './meal-characteristics.constants';
import { INutritionProfileCharacteristic } from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';

export const nextClientMealCharacteristicsApi = {
  getAll: (page: number = 1, limit: number = 10) => {
    return nextClientApiClient.get<IBaseResponse<INutritionProfileCharacteristic[]>>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.GET_ALL,
      {
        params: { page, limit },
      }
    );
  },

  getById: (id: string) => {
    return nextClientApiClient.get<IBaseResponse<INutritionProfileCharacteristic>>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.GET_BY_ID(id)
    );
  },

  delete: (id: string) => {
    return nextClientApiClient.delete<IBaseResponse<number | null | undefined>>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.DELETE(id)
    );
  },
};
