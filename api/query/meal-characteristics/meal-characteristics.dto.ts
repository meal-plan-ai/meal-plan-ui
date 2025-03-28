// DTOs for meal characteristics based on the backend entity

// Enum types from backend
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

// Base DTO with all fields needed for meal characteristic
export interface MealCharacteristicDto {
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
  cookingComplexity?: string;
  additionalPreferences?: string[];
}

// Request DTO for creating a new meal characteristic
export type CreateMealCharacteristicRequestDto = MealCharacteristicDto;

// Request DTO for updating an existing meal characteristic
export interface UpdateMealCharacteristicRequestDto extends MealCharacteristicDto {
  id: string;
}

// Response DTO for meal characteristic
export interface MealCharacteristicResponseDto extends MealCharacteristicDto {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

// Response for paginated list of meal characteristics
export interface PaginatedMealCharacteristicsResponseDto {
  items: MealCharacteristicResponseDto[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Response for deletion
export interface DeleteMealCharacteristicResponseDto {
  success: boolean;
}
