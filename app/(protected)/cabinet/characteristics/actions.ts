'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';
import { revalidatePath } from 'next/cache';

// Mock database for now
let plans = [
  {
    id: '1',
    name: 'Fitness Focus Plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    weight: 75,
    height: 180,
    age: 32,
    activityLevel: 'active',
    goal: 'maintain',
    caloriesTarget: 2500,
    macroDistribution: {
      protein: 35,
      carbs: 40,
      fat: 25,
    },
    mealsPerDay: 4,
    includingSnacks: true,
    nutrientTargets: {
      fiber: 30,
      sugar: 20,
      sodium: 2000,
    },
    vitaminsAndMinerals: [
      { name: 'Vitamin D', priority: 'high' },
      { name: 'Calcium', priority: 'medium' },
      { name: 'Iron', priority: 'medium' },
    ],
    avoidIngredients: ['Dairy', 'Gluten'],
    preferences: {
      organic: true,
      seasonal: true,
      localProduce: true,
      sustainableSeafood: true,
      budgetFriendly: false,
    },
  },
  {
    id: '2',
    name: 'Weight Loss Plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    weight: 82,
    height: 170,
    age: 28,
    activityLevel: 'moderate',
    goal: 'lose',
    caloriesTarget: 1800,
    macroDistribution: {
      protein: 40,
      carbs: 30,
      fat: 30,
    },
    mealsPerDay: 5,
    includingSnacks: true,
    nutrientTargets: {
      fiber: 35,
      sugar: 15,
      sodium: 1800,
    },
    vitaminsAndMinerals: [
      { name: 'Vitamin B12', priority: 'high' },
      { name: 'Magnesium', priority: 'high' },
      { name: 'Zinc', priority: 'low' },
    ],
    avoidIngredients: ['Sugar', 'Processed Foods'],
    preferences: {
      organic: true,
      seasonal: true,
      localProduce: false,
      sustainableSeafood: true,
      budgetFriendly: true,
    },
  },
];

// Define validation schema using zod
const characteristicsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  weight: z.coerce
    .number()
    .min(30, 'Weight must be at least 30kg')
    .max(300, 'Weight must be at most 300kg'),
  height: z.coerce
    .number()
    .min(100, 'Height must be at least 100cm')
    .max(250, 'Height must be at most 250cm'),
  age: z.coerce.number().min(15, 'Age must be at least 15').max(120, 'Age must be at most 120'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive'], {
    errorMap: () => ({ message: 'Please select a valid activity level' }),
  }),
  goal: z.enum(['lose', 'maintain', 'gain'], {
    errorMap: () => ({ message: 'Please select a valid goal' }),
  }),
  caloriesTarget: z.coerce
    .number()
    .min(1000, 'Calories must be at least 1000')
    .max(5000, 'Calories must be at most 5000'),
  includingSnacks: z.coerce.boolean(),
  mealsPerDay: z.coerce
    .number()
    .min(1, 'Must have at least 1 meal per day')
    .max(7, 'Must have at most 7 meals per day'),
});

// For checking that macros add up to 100%
const macroDistributionSchema = z
  .object({
    'macroDistribution.protein': z.coerce
      .number()
      .min(10, 'Protein must be at least 10%')
      .max(60, 'Protein must be at most 60%'),
    'macroDistribution.carbs': z.coerce
      .number()
      .min(10, 'Carbs must be at least 10%')
      .max(70, 'Carbs must be at most 70%'),
    'macroDistribution.fat': z.coerce
      .number()
      .min(10, 'Fat must be at least 10%')
      .max(60, 'Fat must be at most 60%'),
  })
  .refine(
    data => {
      const total =
        data['macroDistribution.protein'] +
        data['macroDistribution.carbs'] +
        data['macroDistribution.fat'];
      return Math.abs(total - 100) <= 1; // Allow for small rounding errors
    },
    {
      message: 'Macronutrient percentages must sum to 100%',
      path: ['macroSum'],
    }
  );

// Nutrient targets schema
const nutrientTargetsSchema = z.object({
  'nutrientTargets.fiber': z.coerce
    .number()
    .min(0, 'Fiber must be non-negative')
    .max(100, 'Fiber must be at most 100g'),
  'nutrientTargets.sugar': z.coerce
    .number()
    .min(0, 'Sugar must be non-negative')
    .max(100, 'Sugar must be at most 100g'),
  'nutrientTargets.sodium': z.coerce
    .number()
    .min(0, 'Sodium must be non-negative')
    .max(5000, 'Sodium must be at most 5000mg'),
});

// Preferences schema
const preferencesSchema = z.object({
  'preferences.organic': z.coerce.boolean(),
  'preferences.seasonal': z.coerce.boolean(),
  'preferences.localProduce': z.coerce.boolean(),
  'preferences.sustainableSeafood': z.coerce.boolean(),
  'preferences.budgetFriendly': z.coerce.boolean(),
});

export type CharacteristicsFormData = z.infer<typeof characteristicsSchema>;

/**
 * Get all characteristics with pagination
 */
export async function getCharacteristics(page: number = 1, perPage: number = 10) {
  // Simulate database pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    data: plans.slice(startIndex, endIndex),
    pagination: {
      total: plans.length,
      page,
      perPage,
      totalPages: Math.ceil(plans.length / perPage),
    },
  };
}

/**
 * Delete a characteristic by ID
 */
export async function deleteCharacteristic(id: string) {
  plans = plans.filter(plan => plan.id !== id);
  revalidatePath('/cabinet/characteristics');
  return { success: true };
}

/**
 * Get a characteristic by ID
 */
export async function getCharacteristicById(id: string) {
  return plans.find(plan => plan.id === id) || null;
}

/**
 * Create a new characteristic with validation
 */
export async function createCharacteristic(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Parse complex form data
    let vitaminsAndMinerals: Array<{ name: string; priority: string }> = [];
    let avoidIngredients: string[] = [];

    try {
      const vitaminsData = formData.get('vitaminsAndMinerals');
      if (vitaminsData) {
        vitaminsAndMinerals = JSON.parse(vitaminsData as string) as Array<{
          name: string;
          priority: string;
        }>;
      }

      const ingredientsData = formData.get('avoidIngredients');
      if (ingredientsData) {
        avoidIngredients = JSON.parse(ingredientsData as string) as string[];
      }
    } catch {
      return toFormState('ERROR', 'Failed to parse complex data');
    }

    // Validate form data
    const validationResult = characteristicsSchema.safeParse(Object.fromEntries(formData));
    const macrosValidation = macroDistributionSchema.safeParse(Object.fromEntries(formData));
    const nutrientValidation = nutrientTargetsSchema.safeParse(Object.fromEntries(formData));
    const preferencesValidation = preferencesSchema.safeParse(Object.fromEntries(formData));

    if (
      !validationResult.success ||
      !macrosValidation.success ||
      !nutrientValidation.success ||
      !preferencesValidation.success
    ) {
      // Combine all validation errors
      const fieldErrors = {
        ...(validationResult.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().fieldErrors || {}),
        ...(nutrientValidation.error?.flatten().fieldErrors || {}),
        ...(preferencesValidation.error?.flatten().fieldErrors || {}),
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

    // Create new characteristic
    const newCharacteristic = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      weight: Number(formData.get('weight')),
      height: Number(formData.get('height')),
      age: Number(formData.get('age')),
      activityLevel: formData.get('activityLevel') as string,
      goal: formData.get('goal') as string,
      caloriesTarget: Number(formData.get('caloriesTarget')),
      macroDistribution: {
        protein: Number(formData.get('macroDistribution.protein')),
        carbs: Number(formData.get('macroDistribution.carbs')),
        fat: Number(formData.get('macroDistribution.fat')),
      },
      mealsPerDay: Number(formData.get('mealsPerDay')),
      includingSnacks: formData.get('includingSnacks') === 'true',
      nutrientTargets: {
        fiber: Number(formData.get('nutrientTargets.fiber')),
        sugar: Number(formData.get('nutrientTargets.sugar')),
        sodium: Number(formData.get('nutrientTargets.sodium')),
      },
      vitaminsAndMinerals,
      avoidIngredients,
      preferences: {
        organic: formData.get('preferences.organic') === 'true',
        seasonal: formData.get('preferences.seasonal') === 'true',
        localProduce: formData.get('preferences.localProduce') === 'true',
        sustainableSeafood: formData.get('preferences.sustainableSeafood') === 'true',
        budgetFriendly: formData.get('preferences.budgetFriendly') === 'true',
      },
    };

    // Save to "database"
    plans.push(newCharacteristic);

    // Revalidate the characteristics list page
    revalidatePath('/cabinet/characteristics');

    // Return success
    return toFormState('SUCCESS', 'Nutrition plan created successfully');
  } catch (error) {
    return fromErrorToFormState(error);
  }
}

/**
 * Update an existing characteristic with validation
 */
export async function updateCharacteristic(
  prevState: FormState,
  formData: FormData,
  id: string
): Promise<FormState> {
  try {
    // Check if the plan exists
    const existingPlanIndex = plans.findIndex(plan => plan.id === id);
    if (existingPlanIndex === -1) {
      return toFormState('ERROR', 'Nutrition plan not found');
    }

    // Parse complex form data
    let vitaminsAndMinerals: Array<{ name: string; priority: string }> = [];
    let avoidIngredients: string[] = [];

    try {
      const vitaminsData = formData.get('vitaminsAndMinerals');
      if (vitaminsData) {
        vitaminsAndMinerals = JSON.parse(vitaminsData as string) as Array<{
          name: string;
          priority: string;
        }>;
      }

      const ingredientsData = formData.get('avoidIngredients');
      if (ingredientsData) {
        avoidIngredients = JSON.parse(ingredientsData as string) as string[];
      }
    } catch {
      return toFormState('ERROR', 'Failed to parse complex data');
    }

    // Validate form data
    const validationResult = characteristicsSchema.safeParse(Object.fromEntries(formData));
    const macrosValidation = macroDistributionSchema.safeParse(Object.fromEntries(formData));
    const nutrientValidation = nutrientTargetsSchema.safeParse(Object.fromEntries(formData));
    const preferencesValidation = preferencesSchema.safeParse(Object.fromEntries(formData));

    if (
      !validationResult.success ||
      !macrosValidation.success ||
      !nutrientValidation.success ||
      !preferencesValidation.success
    ) {
      // Combine all validation errors
      const fieldErrors = {
        ...(validationResult.error?.flatten().fieldErrors || {}),
        ...(macrosValidation.error?.flatten().fieldErrors || {}),
        ...(nutrientValidation.error?.flatten().fieldErrors || {}),
        ...(preferencesValidation.error?.flatten().fieldErrors || {}),
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

    // Update the characteristic
    const updatedCharacteristic = {
      ...plans[existingPlanIndex],
      name: formData.get('name') as string,
      updatedAt: new Date().toISOString(),
      weight: Number(formData.get('weight')),
      height: Number(formData.get('height')),
      age: Number(formData.get('age')),
      activityLevel: formData.get('activityLevel') as string,
      goal: formData.get('goal') as string,
      caloriesTarget: Number(formData.get('caloriesTarget')),
      macroDistribution: {
        protein: Number(formData.get('macroDistribution.protein')),
        carbs: Number(formData.get('macroDistribution.carbs')),
        fat: Number(formData.get('macroDistribution.fat')),
      },
      mealsPerDay: Number(formData.get('mealsPerDay')),
      includingSnacks: formData.get('includingSnacks') === 'true',
      nutrientTargets: {
        fiber: Number(formData.get('nutrientTargets.fiber')),
        sugar: Number(formData.get('nutrientTargets.sugar')),
        sodium: Number(formData.get('nutrientTargets.sodium')),
      },
      vitaminsAndMinerals,
      avoidIngredients,
      preferences: {
        organic: formData.get('preferences.organic') === 'true',
        seasonal: formData.get('preferences.seasonal') === 'true',
        localProduce: formData.get('preferences.localProduce') === 'true',
        sustainableSeafood: formData.get('preferences.sustainableSeafood') === 'true',
        budgetFriendly: formData.get('preferences.budgetFriendly') === 'true',
      },
    };

    // Save to "database"
    plans[existingPlanIndex] = updatedCharacteristic;

    // Revalidate the characteristics list page
    revalidatePath('/cabinet/characteristics');

    // Return success
    return toFormState('SUCCESS', 'Nutrition plan updated successfully');
  } catch (error) {
    return fromErrorToFormState(error);
  }
}
