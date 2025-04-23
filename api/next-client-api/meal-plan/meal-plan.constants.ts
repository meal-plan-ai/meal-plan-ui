export const NEXT_CLIENT_MEAL_PLAN_ENDPOINTS = {
  BASE: '/meal-plan',
  GET_ALL: '/meal-plan',
  GET_BY_ID: (id: string) => `/meal-plan/${id}`,
  CREATE: '/meal-plan',
  UPDATE: (id: string) => `/meal-plan/${id}`,
  DELETE: (id: string) => `/meal-plan/${id}`,
  GET_USER_PLANS: '/meal-plan/user',
  GENERATE_AI_PLAN: (id: string) => `/meal-plan/${id}/generate-ai-plan`,
};
