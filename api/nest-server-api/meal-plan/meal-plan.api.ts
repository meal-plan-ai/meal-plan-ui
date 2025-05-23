import { nestServerApiClient } from '../nestServerApiClient';
import { NEST_SERVER_MEAL_PLAN_ENDPOINTS } from './meal-plan.constants';
import { IAiGeneratedMealPlan, IMealPlan, IMealPlanCreate } from './meal-plan.types';
import { IBaseResponse } from '@/api/api.types';

export const nestServerMealPlanApi = {
  getAll: (page = 1, limit = 10) => {
    return nestServerApiClient.get<IBaseResponse<IMealPlan[]>>(
      `${NEST_SERVER_MEAL_PLAN_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
    );
  },

  getUserPlans: () => {
    return nestServerApiClient.get<IBaseResponse<IMealPlan[]>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.BY_USER
    );
  },

  getById: (id: IMealPlan['id']) => {
    return nestServerApiClient.get<IBaseResponse<IMealPlan>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.BY_ID(id)
    );
  },

  create: (data: IMealPlanCreate) => {
    return nestServerApiClient.post<IBaseResponse<IMealPlan>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.BASE,
      data
    );
  },

  update: (id: IMealPlan['id'], data: Partial<IMealPlan>) => {
    return nestServerApiClient.patch<IBaseResponse<IMealPlan>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.BY_ID(id),
      data
    );
  },

  delete: (id: IMealPlan['id']) => {
    return nestServerApiClient.delete<IBaseResponse<number | null | undefined>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.BY_ID(id)
    );
  },

  generateAiPlan: (id: IMealPlan['id']) => {
    return nestServerApiClient.post<IBaseResponse<IAiGeneratedMealPlan>>(
      NEST_SERVER_MEAL_PLAN_ENDPOINTS.GENERATE_AI_PLAN(id),
      {}
    );
  },
};
