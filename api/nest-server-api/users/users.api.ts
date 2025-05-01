import { nestServerApiClient } from '../nestServerApiClient';
import { AxiosResponse } from 'axios';
import { NEST_SERVER_USERS_ENDPOINTS } from './users.constants';
import { UserResponseDto, CurrentUserResponseDto, PaginatedUsersResponseDto } from './users.types';

export const nestServerUsersApi = {
  getCurrentUser: (): Promise<AxiosResponse<CurrentUserResponseDto>> => {
    return nestServerApiClient.get<CurrentUserResponseDto>(NEST_SERVER_USERS_ENDPOINTS.ME);
  },

  getUsers: (page = 1, limit = 10): Promise<AxiosResponse<PaginatedUsersResponseDto>> => {
    return nestServerApiClient.get<PaginatedUsersResponseDto>(
      `${NEST_SERVER_USERS_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
    );
  },

  getUserById: (id: string): Promise<AxiosResponse<UserResponseDto>> => {
    return nestServerApiClient.get<UserResponseDto>(NEST_SERVER_USERS_ENDPOINTS.BY_ID(id));
  },
};
