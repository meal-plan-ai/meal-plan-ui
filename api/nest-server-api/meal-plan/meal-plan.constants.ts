export const NEST_SERVER_MEAL_PLAN_ENDPOINTS = {
  BASE: '/meal-plans',
  BY_ID: (id: string) => `/meal-plans/${id}`,
  BY_USER: '/meal-plans/user',
  GENERATE_AI_PLAN: (id: string) => `/meal-plans/${id}/generate-ai-plan`,
};
