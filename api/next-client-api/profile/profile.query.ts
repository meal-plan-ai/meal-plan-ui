import { AxiosResponse } from 'axios';
import nextClientApiClient from '../nextClientApiClient';
import { NEXT_CLIENT_PROFILE_ENDPOINTS } from './profile.constants';
import { ProfileResponseDto, UpdateProfileDto } from './profile.dto';

export const nextClientProfileApi = {
  getMyProfile: (): Promise<AxiosResponse<ProfileResponseDto>> => {
    return nextClientApiClient.get<ProfileResponseDto>(NEXT_CLIENT_PROFILE_ENDPOINTS.ME);
  },

  updateProfile: (data: UpdateProfileDto): Promise<AxiosResponse<ProfileResponseDto>> => {
    return nextClientApiClient.patch<ProfileResponseDto>(
      NEXT_CLIENT_PROFILE_ENDPOINTS.UPDATE(data.id),
      data
    );
  },
};
