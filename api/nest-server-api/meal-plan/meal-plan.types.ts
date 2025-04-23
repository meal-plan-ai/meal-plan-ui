import { IMealCharacteristic } from '../meal-characteristics/meal-characteristics.types';

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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealPlan {
  id: string;
  name: string;
  userId?: string;
  durationInDays: number;
  createdAt: Date;
  updatedAt: Date;
  mealCharacteristicId?: string;
  mealCharacteristic?: IMealCharacteristic;
  aiGeneratedMealPlanId?: string;
  aiGeneratedMealPlan?: IAiGeneratedMealPlan;
}

export type IMealPlanCreate = Omit<IMealPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
