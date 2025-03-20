import { IProfile } from "./profile.types";

export type ProfileResponseDto = IProfile

export interface UpdateProfileDto {
  id: string;
  firstName?: string;
  lastName?: string;
}