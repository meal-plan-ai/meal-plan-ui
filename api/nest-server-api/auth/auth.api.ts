import backendApiClient from '../nestServerApiClient';
import { AxiosResponse } from 'axios';
import { NEST_SERVER_AUTH_ENDPOINTS } from './auth.constants';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  NewPasswordRequestDto,
  NewPasswordResponseDto,
  LogoutResponseDto,
} from './auth.types';

export const nestServerAuthApi = {
  login: (credentials: LoginRequestDto): Promise<AxiosResponse<LoginResponseDto>> => {
    return backendApiClient.post<LoginResponseDto>(NEST_SERVER_AUTH_ENDPOINTS.LOGIN, credentials);
  },

  register: (userData: RegisterRequestDto): Promise<AxiosResponse<RegisterResponseDto>> => {
    return backendApiClient.post<RegisterResponseDto>(
      NEST_SERVER_AUTH_ENDPOINTS.REGISTER,
      userData
    );
  },

  logout: (): Promise<AxiosResponse<LogoutResponseDto>> => {
    return backendApiClient.post<LogoutResponseDto>(NEST_SERVER_AUTH_ENDPOINTS.LOGOUT);
  },

  changePassword: (
    passwordData: NewPasswordRequestDto
  ): Promise<AxiosResponse<NewPasswordResponseDto>> => {
    return backendApiClient.post<NewPasswordResponseDto>(
      NEST_SERVER_AUTH_ENDPOINTS.NEW_PASSWORD,
      passwordData
    );
  },
};
