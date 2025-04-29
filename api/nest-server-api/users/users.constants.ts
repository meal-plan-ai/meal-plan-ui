export const NEST_SERVER_USERS_ENDPOINTS = {
  ME: '/users/me',
  BASE: '/users',
  BY_ID: (id: string) => `/users/${id}`,
  GET_USER_SUBSCRIPTION: `/subscriptions/status`,
};
