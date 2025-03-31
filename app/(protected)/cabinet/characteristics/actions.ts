'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';
import { revalidatePath } from 'next/cache';
import {
  ActivityLevel,
  Gender,
  Goal,
  CookingComplexity,
} from '@/api/next-client-api/meal-characteristics/meal-characteristics.dto';
import {
  CreateMealCharacteristicRequestDto,
  UpdateMealCharacteristicRequestDto,
} from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';
import { nestServerMealCharacteristicsApi } from '@/api/nest-server-api/meal-characteristics/meal-characteristics.api';

const characteristicsSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
  age: z.coerce.number().min(15, 'Age must be at least 15').max(120, 'Age must be at most 120'),
  height: z.coerce
    .number()
    .min(50, 'Height must be at least 50cm')
    .max(250, 'Height must be at most 250cm'),
  weight: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(300, 'Weight must be at most 300kg'),
  activityLevel: z.enum(Object.values(ActivityLevel) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid activity level' }),
  }),
  goal: z.enum(Object.values(Goal) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid goal' }),
  }),
  targetDailyCalories: z.coerce
    .number()
    .min(1000, 'Calories must be at least 1000')
    .max(3500, 'Calories must be at most 3500'),
  proteinPercentage: z.coerce
    .number()
    .min(0, 'Protein percentage must be at least 0')
    .max(100, 'Protein percentage must be at most 100'),
  fatPercentage: z.coerce
    .number()
    .min(0, 'Fat percentage must be at least 0')
    .max(100, 'Fat percentage must be at most 100'),
  carbsPercentage: z.coerce
    .number()
    .min(0, 'Carbs percentage must be at least 0')
    .max(100, 'Carbs percentage must be at most 100'),
  includeSnacks: z.coerce
    .number()
    .min(0, 'Snacks must be at least 0')
    .max(2, 'Snacks must be at most 2')
    .default(0),
  mealsPerDay: z.coerce
    .number()
    .min(1, 'Must have at least 1 meal per day')
    .max(3, 'Must have at most 3 meals per day')
    .default(3),
  cookingComplexity: z.enum(Object.values(CookingComplexity) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid cooking complexity' }),
  }),
});

const macroDistributionSchema = z
  .object({
    proteinPercentage: z.coerce
      .number()
      .min(10, 'Protein must be at least 10%')
      .max(60, 'Protein must be at most 60%')
      .optional(),
    carbsPercentage: z.coerce
      .number()
      .min(10, 'Carbs must be at least 10%')
      .max(70, 'Carbs must be at most 70%')
      .optional(),
    fatPercentage: z.coerce
      .number()
      .min(10, 'Fat must be at least 10%')
      .max(60, 'Fat must be at most 60%')
      .optional(),
  })
  .refine(
    data => {
      if (
        data.proteinPercentage != null &&
        data.carbsPercentage != null &&
        data.fatPercentage != null
      ) {
        const total = data.proteinPercentage + data.carbsPercentage + data.fatPercentage;
        return Math.abs(total - 100) <= 1; // Allow for small rounding errors
      }
      return true;
    },
    {
      message: 'Macronutrient percentages must sum to 100%',
      path: ['macroSum'],
    }
  );

export async function createCharacteristic(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    let medicalConditions: string[] = [];
    let dietType: string[] = [];
    let dietaryRestrictions: string[] = [];
    let vitaminsAndMinerals: string[] = [];
    let nutrientTargets: Record<string, number> = {};
    let additionalPreferences: string[] = [];

    try {
      const medicalConditionsData = formData.get('medicalConditions');
      if (medicalConditionsData) {
        medicalConditions = JSON.parse(medicalConditionsData as string) as string[];
      }

      const dietTypeData = formData.get('dietType');
      if (dietTypeData) {
        dietType = JSON.parse(dietTypeData as string) as string[];
      }

      const dietaryRestrictionsData = formData.get('dietaryRestrictions');
      if (dietaryRestrictionsData) {
        dietaryRestrictions = JSON.parse(dietaryRestrictionsData as string) as string[];
      }

      const vitaminsData = formData.get('vitaminsAndMinerals');
      if (vitaminsData) {
        vitaminsAndMinerals = JSON.parse(vitaminsData as string) as string[];
      }

      const nutrientTargetsData = formData.get('nutrientTargets');
      if (nutrientTargetsData) {
        nutrientTargets = JSON.parse(nutrientTargetsData as string) as Record<string, number>;
      }

      const preferencesData = formData.get('additionalPreferences');
      if (preferencesData) {
        additionalPreferences = JSON.parse(preferencesData as string) as string[];
      }
    } catch {
      return toFormState('ERROR', 'Failed to parse complex data');
    }

    const formDataObject = Object.fromEntries(formData.entries());
    const validationResult = characteristicsSchema.safeParse(formDataObject);
    const macrosValidation = macroDistributionSchema.safeParse(formDataObject);

    if (!validationResult.success || !macrosValidation.success) {
      const fieldErrors = {
        ...(validationResult.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().formErrors.length
          ? { macroSum: macrosValidation.error.flatten().formErrors }
          : {}),
      };

      return {
        status: 'ERROR',
        message: 'Please fix the validation errors',
        fieldErrors,
        timestamp: Date.now(),
      };
    }

    const targetDailyCaloriesValue = formData.get('targetDailyCalories');
    const targetDailyCalories = targetDailyCaloriesValue
      ? Number(targetDailyCaloriesValue)
      : undefined;

    if (targetDailyCalories === undefined || isNaN(targetDailyCalories)) {
      return {
        status: 'ERROR',
        message: 'Daily calorie target is required and must be a valid number',
        fieldErrors: { targetDailyCalories: ['Daily calorie target is required'] },
        timestamp: Date.now(),
      };
    }

    const characteristicData: CreateMealCharacteristicRequestDto = {
      planName: formData.get('planName') as string,
      gender: formData.get('gender') as Gender,
      age: formData.get('age') ? Number(formData.get('age')) : undefined,
      height: formData.get('height') ? Number(formData.get('height')) : undefined,
      weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
      activityLevel: (formData.get('activityLevel') as ActivityLevel) || undefined,
      goal: (formData.get('goal') as Goal) || undefined,
      targetDailyCalories: targetDailyCalories,
      proteinPercentage: formData.get('proteinPercentage')
        ? Number(formData.get('proteinPercentage'))
        : undefined,
      fatPercentage: formData.get('fatPercentage')
        ? Number(formData.get('fatPercentage'))
        : undefined,
      carbsPercentage: formData.get('carbsPercentage')
        ? Number(formData.get('carbsPercentage'))
        : undefined,
      includeSnacks: Number(formData.get('includeSnacks') || 0),
      mealsPerDay: Number(formData.get('mealsPerDay') || 3),
      medicalConditions,
      dietType,
      dietaryRestrictions,
      vitaminsAndMinerals,
      nutrientTargets,
      cookingComplexity: (formData.get('cookingComplexity') as CookingComplexity) || undefined,
      additionalPreferences,
    };
    try {
      await nestServerMealCharacteristicsApi.create(characteristicData);

      revalidatePath('/cabinet/characteristics');

      return toFormState('SUCCESS', 'Nutrition plan created successfully');
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          return toFormState('ERROR', axiosError.response.data.message);
        }
      }
      return fromErrorToFormState(error);
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }
}

export async function updateCharacteristic(
  prevState: FormState,
  formData: FormData,
  id: string
): Promise<FormState> {
  try {
    // Parse complex form data
    let medicalConditions: string[] = [];
    let dietType: string[] = [];
    let dietaryRestrictions: string[] = [];
    let vitaminsAndMinerals: string[] = [];
    let nutrientTargets: Record<string, number> = {};
    let additionalPreferences: string[] = [];

    try {
      const medicalConditionsData = formData.get('medicalConditions');
      if (medicalConditionsData) {
        medicalConditions = JSON.parse(medicalConditionsData as string) as string[];
      }

      const dietTypeData = formData.get('dietType');
      if (dietTypeData) {
        dietType = JSON.parse(dietTypeData as string) as string[];
      }

      const dietaryRestrictionsData = formData.get('dietaryRestrictions');
      if (dietaryRestrictionsData) {
        dietaryRestrictions = JSON.parse(dietaryRestrictionsData as string) as string[];
      }

      const vitaminsData = formData.get('vitaminsAndMinerals');
      if (vitaminsData) {
        vitaminsAndMinerals = JSON.parse(vitaminsData as string) as string[];
      }

      const nutrientTargetsData = formData.get('nutrientTargets');
      if (nutrientTargetsData) {
        nutrientTargets = JSON.parse(nutrientTargetsData as string) as Record<string, number>;
      }

      const preferencesData = formData.get('additionalPreferences');
      if (preferencesData) {
        additionalPreferences = JSON.parse(preferencesData as string) as string[];
      }
    } catch {
      return toFormState('ERROR', 'Failed to parse complex data');
    }

    const formDataObject = Object.fromEntries(formData.entries());

    const validationResult = characteristicsSchema.safeParse(formDataObject);
    const macrosValidation = macroDistributionSchema.safeParse(formDataObject);

    if (!validationResult.success || !macrosValidation.success) {
      const fieldErrors = {
        ...(validationResult.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().formErrors.length
          ? { macroSum: macrosValidation.error.flatten().formErrors }
          : {}),
      };

      return {
        status: 'ERROR',
        message: 'Please fix the validation errors',
        fieldErrors,
        timestamp: Date.now(),
      };
    }

    const targetDailyCaloriesValue = formData.get('targetDailyCalories');
    const targetDailyCalories = targetDailyCaloriesValue
      ? Number(targetDailyCaloriesValue)
      : undefined;

    if (targetDailyCalories === undefined || isNaN(targetDailyCalories)) {
      return {
        status: 'ERROR',
        message: 'Daily calorie target is required and must be a valid number',
        fieldErrors: { targetDailyCalories: ['Daily calorie target is required'] },
        timestamp: Date.now(),
      };
    }

    const characteristicData: UpdateMealCharacteristicRequestDto = {
      id,
      planName: formData.get('planName') as string,
      gender: formData.get('gender') as Gender,
      age: formData.get('age') ? Number(formData.get('age')) : undefined,
      height: formData.get('height') ? Number(formData.get('height')) : undefined,
      weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
      activityLevel: (formData.get('activityLevel') as ActivityLevel) || undefined,
      goal: (formData.get('goal') as Goal) || undefined,
      targetDailyCalories: targetDailyCalories,
      proteinPercentage: formData.get('proteinPercentage')
        ? Number(formData.get('proteinPercentage'))
        : undefined,
      fatPercentage: formData.get('fatPercentage')
        ? Number(formData.get('fatPercentage'))
        : undefined,
      carbsPercentage: formData.get('carbsPercentage')
        ? Number(formData.get('carbsPercentage'))
        : undefined,
      includeSnacks: Number(formData.get('includeSnacks') || 0),
      mealsPerDay: Number(formData.get('mealsPerDay') || 3),
      medicalConditions,
      dietType,
      dietaryRestrictions,
      vitaminsAndMinerals,
      nutrientTargets,
      cookingComplexity: (formData.get('cookingComplexity') as CookingComplexity) || undefined,
      additionalPreferences,
    };

    try {
      console.log('characteristicData', characteristicData);
      await nestServerMealCharacteristicsApi.update(id, characteristicData);

      revalidatePath('/cabinet/characteristics');

      return toFormState('SUCCESS', 'Nutrition plan updated successfully');
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          return toFormState('ERROR', axiosError.response.data.message);
        }
      }
      return fromErrorToFormState(error);
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }
}
