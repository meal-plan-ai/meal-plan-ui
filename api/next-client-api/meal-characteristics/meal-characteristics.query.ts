import { AxiosResponse } from 'axios';
import nextClientApiClient from '../nextClientApiClient';
import { NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS } from './meal-characteristics.constants';
import {
  MealCharacteristicResponseDto,
  PaginatedMealCharacteristicsResponseDto,
  DeleteMealCharacteristicResponseDto,
} from './meal-characteristics.dto';

export const nextClientMealCharacteristicsApi = {
  getAll: (
    page: number = 1,
    limit: number = 10
  ): Promise<AxiosResponse<PaginatedMealCharacteristicsResponseDto>> => {
    return nextClientApiClient.get<PaginatedMealCharacteristicsResponseDto>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.GET_ALL,
      {
        params: { page, limit },
      }
    );
  },

  getById: (id: string): Promise<AxiosResponse<MealCharacteristicResponseDto>> => {
    return nextClientApiClient.get<MealCharacteristicResponseDto>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.GET_BY_ID(id)
    );
  },

  delete: (id: string): Promise<AxiosResponse<DeleteMealCharacteristicResponseDto>> => {
    return nextClientApiClient.delete<DeleteMealCharacteristicResponseDto>(
      NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS.DELETE(id)
    );
  },
};
