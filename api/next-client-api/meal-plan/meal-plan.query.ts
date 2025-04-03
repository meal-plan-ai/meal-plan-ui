import { IBaseResponse } from '@/api/api.types';
import nextClientApiClient from '../nextClientApiClient';
import { NEXT_CLIENT_MEAL_PLAN_ENDPOINTS } from './meal-plan.constants';
import { IMealPlan } from '@/api/nest-server-api/meal-plan/meal-plan.types';

export const nextClientMealPlanApi = {
  getAll: (page: number = 1, limit: number = 10) => {
    return nextClientApiClient.get<IBaseResponse<IMealPlan[]>>(
      NEXT_CLIENT_MEAL_PLAN_ENDPOINTS.GET_ALL,
      {
        params: { page, limit },
      }
    );
  },

  getUserPlans: () => {
    return nextClientApiClient.get<IBaseResponse<IMealPlan[]>>(
      NEXT_CLIENT_MEAL_PLAN_ENDPOINTS.GET_USER_PLANS
    );
  },

  getById: (id: string) => {
    return nextClientApiClient.get<IBaseResponse<IMealPlan>>(
      NEXT_CLIENT_MEAL_PLAN_ENDPOINTS.GET_BY_ID(id)
    );
  },

  delete: (id: string) => {
    return nextClientApiClient.delete<IBaseResponse<number | null | undefined>>(
      NEXT_CLIENT_MEAL_PLAN_ENDPOINTS.DELETE(id)
    );
  },
};
