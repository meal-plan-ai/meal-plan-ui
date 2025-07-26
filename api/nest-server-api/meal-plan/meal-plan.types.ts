import { EMealType } from '../../../types/meal-plan.types';
import { INutritionProfileCharacteristic } from '../meal-characteristics/meal-characteristics.types';

export * from '../../../types/meal-plan.types';
export type { INutritionProfileCharacteristic } from '../meal-characteristics/meal-characteristics.types';

export enum AiGenerationStatus {
  IDLE = 'idle',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IAiMealPlanResponse {
  days: IAiDayPlan[];
}

export interface IAiDayPlan {
  dayNumber: number;
  date?: string; // Optional ISO date string
  totalNutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  meals: IAiMeal[];
}

export interface IAiMeal {
  mealType: EMealType;
  name: string;
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  recipe: {
    ingredients: IAiIngredient[];
    instructions: string[];
    preparationTime: number; // minutes
    cookingTime: number; // minutes
  };
  tags: string[]; // e.g., "vegetarian", "high-protein", "low-carb"
}

export interface IAiIngredient {
  name: string;
  amount: number;
  unit: string; // e.g., "g", "ml", "tbsp"
}

export interface IAiGeneratedMealPlan {
  id: string;
  mealPlanId: string;
  userId: string;
  generatedPlan: IAiMealPlanResponse;
  createdAt: string;
  updatedAt: string;
}

export interface IMealPlan {
  id: string;
  name: string;
  userId?: string;
  durationInDays: number;
  createdAt: string;
  updatedAt: string;
  mealCharacteristicId?: string;
  mealCharacteristic?: INutritionProfileCharacteristic;
  aiGeneratedMealPlanId?: string;
  aiGeneratedMealPlan?: IAiGeneratedMealPlan;
  aiGenerationStatus?: AiGenerationStatus;
}

export type IMealPlanCreate = Omit<IMealPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
