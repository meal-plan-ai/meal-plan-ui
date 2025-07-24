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

export interface INutritionProfileCharacteristic {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
}

export type INutritionProfileCharacteristicCreate = Omit<
  INutritionProfileCharacteristic,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;
