export interface IMealPlan {
  id: string;
  name: string;
  durationInDays: number;
  mealCharacteristicId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export type IMealPlanCreate = Omit<IMealPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
