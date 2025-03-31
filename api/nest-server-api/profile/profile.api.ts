import backendApiClient from '../nestServerApiClient';
import { AxiosResponse } from 'axios';
import { NEST_SERVER_PROFILE_ENDPOINTS } from './profile.constants';
import { ProfileResponseDto, UpdateProfileRequestDto } from './profile.types';

export const nestServerProfileApi = {
  getMyProfile: (): Promise<AxiosResponse<ProfileResponseDto>> => {
    return backendApiClient.get<ProfileResponseDto>(NEST_SERVER_PROFILE_ENDPOINTS.ME);
  },

  getProfileById: (id: string): Promise<AxiosResponse<ProfileResponseDto>> => {
    return backendApiClient.get<ProfileResponseDto>(NEST_SERVER_PROFILE_ENDPOINTS.BY_ID(id));
  },

  updateProfile: (
    id: string,
    data: UpdateProfileRequestDto
  ): Promise<AxiosResponse<ProfileResponseDto>> => {
    return backendApiClient.patch<ProfileResponseDto>(
      NEST_SERVER_PROFILE_ENDPOINTS.BY_ID(id),
      data
    );
  },

  updateMyProfile: (data: UpdateProfileRequestDto): Promise<AxiosResponse<ProfileResponseDto>> => {
    return backendApiClient.patch<ProfileResponseDto>(NEST_SERVER_PROFILE_ENDPOINTS.ME, data);
  },
};
