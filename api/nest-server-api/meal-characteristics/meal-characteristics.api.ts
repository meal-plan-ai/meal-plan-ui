import backendApiClient from '../nestServerApiClient';
import { AxiosResponse } from 'axios';
import { NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS } from './meal-characteristics.constants';
import {
  CreateMealCharacteristicRequestDto,
  UpdateMealCharacteristicRequestDto,
  MealCharacteristicResponseDto,
  PaginatedMealCharacteristicsResponseDto,
} from './meal-characteristics.types';

export const nestServerMealCharacteristicsApi = {
  getAll: (
    page = 1,
    limit = 10
  ): Promise<AxiosResponse<PaginatedMealCharacteristicsResponseDto>> => {
    return backendApiClient.get<PaginatedMealCharacteristicsResponseDto>(
      `${NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
    );
  },

  getById: (id: string): Promise<AxiosResponse<MealCharacteristicResponseDto>> => {
    return backendApiClient.get<MealCharacteristicResponseDto>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id)
    );
  },

  create: (
    data: CreateMealCharacteristicRequestDto
  ): Promise<AxiosResponse<MealCharacteristicResponseDto>> => {
    return backendApiClient.post<MealCharacteristicResponseDto>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BASE,
      data
    );
  },

  update: (
    id: string,
    data: UpdateMealCharacteristicRequestDto
  ): Promise<AxiosResponse<MealCharacteristicResponseDto>> => {
    console.log('data 222', data);
    return backendApiClient.patch<MealCharacteristicResponseDto>(
      NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id),
      data
    );
  },

  delete: (id: string): Promise<AxiosResponse<void>> => {
    return backendApiClient.delete<void>(NEST_SERVER_MEAL_CHARACTERISTICS_ENDPOINTS.BY_ID(id));
  },
};
