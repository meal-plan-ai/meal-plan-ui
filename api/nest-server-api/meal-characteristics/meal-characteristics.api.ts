import backendApiClient from '../nestServerApiClient';
import { NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS } from './meal-characteristics.constants';
import { IMealCharacteristic, IMealCharacteristicCreate } from './meal-characteristics.types';
import { IBaseResponse } from '@/api/api.types';

export const nestServerMealCharacteristicsApi = {
  getAll: (page = 1, limit = 10) => {
    return backendApiClient.get<IBaseResponse<IMealCharacteristic[]>>(
      `${NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
    );
  },

  getById: (id: IMealCharacteristic['id']) => {
    return backendApiClient.get<IBaseResponse<IMealCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id)
    );
  },

  create: (data: IMealCharacteristicCreate) => {
    return backendApiClient.post<IBaseResponse<IMealCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE,
      data
    );
  },

  update: (id: IMealCharacteristic['id'], data: Partial<IMealCharacteristic>) => {
    return backendApiClient.patch<IBaseResponse<IMealCharacteristic>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id),
      data
    );
  },

  delete: (id: IMealCharacteristic['id']) => {
    return backendApiClient.delete<IBaseResponse<number | null | undefined>>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id)
    );
  },
};
