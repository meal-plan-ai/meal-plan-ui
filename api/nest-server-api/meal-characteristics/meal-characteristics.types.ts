export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHT = 'Light',
  MODERATE = 'Moderate',
  ACTIVE = 'Active',
  VERY_ACTIVE = 'Very Active',
}

export enum Goal {
  MAINTENANCE = 'Maintenance',
  WEIGHT_LOSS = 'Weight Loss',
  MUSCLE_GAIN = 'Muscle Gain',
}

export enum CookingComplexity {
  QUICK = 'Quick & Easy',
  STANDARD = 'Standard',
  GOURMET = 'Gourmet',
}

export interface CreateMealCharacteristicRequestDto {
  planName: string;
  gender?: Gender;
  age?: number;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  activityCalories?: number;
  goal?: Goal;
  targetDailyCalories?: number;
  proteinPercentage?: number;
  fatPercentage?: number;
  carbsPercentage?: number;
  includeSnacks?: number;
  mealsPerDay?: number;
  medicalConditions?: string[];
  dietType?: string[];
  dietaryRestrictions?: string[];
  vitaminsAndMinerals?: string[];
  nutrientTargets?: Record<string, number>;
  cookingComplexity?: CookingComplexity;
  additionalPreferences?: string[];
}

export interface UpdateMealCharacteristicRequestDto extends CreateMealCharacteristicRequestDto {
  id: string;
}

export interface MealCharacteristicResponseDto extends CreateMealCharacteristicRequestDto {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMealCharacteristicsResponseDto {
  items: MealCharacteristicResponseDto[];
  totalItems: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
