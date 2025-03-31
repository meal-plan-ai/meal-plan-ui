export interface IProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  biography?: string;
  avatarUrl?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
