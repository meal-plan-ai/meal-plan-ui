import { AxiosResponse } from 'axios';
import nextClientApiClient from '../nextClientApiClient';
import { NEXT_CLIENT_USERS_ENDPOINTS } from './users.constants';
import { ChangePasswordDto, ChangePasswordResponseDto, UserResponseDto } from './users.dto';
import { ResponseSubscriptionDto } from '@/api/nest-server-api/users/users.types';

export const nextClientUsersApi = {
  getCurrentUser: (): Promise<AxiosResponse<UserResponseDto>> => {
    return nextClientApiClient.get<UserResponseDto>(NEXT_CLIENT_USERS_ENDPOINTS.ME);
  },

  changePassword: (data: ChangePasswordDto): Promise<AxiosResponse<ChangePasswordResponseDto>> => {
    return nextClientApiClient.post<ChangePasswordResponseDto>(
      NEXT_CLIENT_USERS_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
  },

  getUserSubscription: (): Promise<AxiosResponse<ResponseSubscriptionDto>> => {
    return nextClientApiClient.get<ResponseSubscriptionDto>(
      NEXT_CLIENT_USERS_ENDPOINTS.GET_USER_SUBSCRIPTION
    );
  },
};
