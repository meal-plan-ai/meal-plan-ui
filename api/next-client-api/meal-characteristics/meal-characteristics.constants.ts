export const NEXT_CLIENT_MEAL_CHARACTERISTICS_ENDPOINTS = {
  BASE: '/meal-characteristics',
  GET_ALL: '/meal-characteristics',
  GET_BY_ID: (id: string) => `/meal-characteristics/${id}`,
  CREATE: '/meal-characteristics',
  UPDATE: (id: string) => `/meal-characteristics/${id}`,
  DELETE: (id: string) => `/meal-characteristics/${id}`,
};
