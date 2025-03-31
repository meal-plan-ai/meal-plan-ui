import { AxiosResponse } from 'axios';
import nextClientApiClient from '../nextClientApiClient';
import { NEXT_CLIENT_AUTH_ENDPOINTS } from './auth.constants';
import { LogoutResponseDto } from './auth.types';

export const nextClientAuthApi = {
  logout: (): Promise<AxiosResponse<LogoutResponseDto>> => {
    return nextClientApiClient.post<LogoutResponseDto>(NEXT_CLIENT_AUTH_ENDPOINTS.LOGOUT);
  },
};
