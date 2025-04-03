'use server';

import { nestServerMealPlanApi, IMealPlan, IMealPlanCreate } from '@/api/nest-server-api';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const mealPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  durationInDays: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  mealCharacteristicId: z.string().optional(),
});

export async function createMealPlan(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const name = formData.get('name') as string;
    const durationInDays = Number(formData.get('durationInDays'));
    const mealCharacteristicId = (formData.get('mealCharacteristicId') as string) || undefined;

    const validationResult = mealPlanSchema.safeParse({
      name,
      durationInDays,
      mealCharacteristicId,
    });

    if (!validationResult.success) {
      return {
        status: 'ERROR',
        message: 'Please fix the validation errors',
        fieldErrors: validationResult.error.flatten().fieldErrors,
        timestamp: Date.now(),
      };
    }

    const mealPlanData: IMealPlanCreate = {
      name,
      durationInDays,
      mealCharacteristicId: mealCharacteristicId || undefined,
    };

    try {
      await nestServerMealPlanApi.create(mealPlanData);
      revalidatePath('/cabinet/plans');
      return toFormState('SUCCESS', 'Meal plan created successfully');
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

export async function updateMealPlan(
  prevState: FormState,
  formData: FormData,
  id: string
): Promise<FormState> {
  console.log('updateMealPlan', id, formData);
  try {
    const name = formData.get('name') as string;
    const durationInDays = Number(formData.get('durationInDays'));
    const mealCharacteristicId = (formData.get('mealCharacteristicId') as string) || undefined;

    const validationResult = mealPlanSchema.safeParse({
      name,
      durationInDays,
      mealCharacteristicId,
    });

    if (!validationResult.success) {
      return {
        status: 'ERROR',
        message: 'Please fix the validation errors',
        fieldErrors: validationResult.error.flatten().fieldErrors,
        timestamp: Date.now(),
      };
    }

    const mealPlanData: Partial<IMealPlan> = {
      id,
      name,
      durationInDays,
      mealCharacteristicId: mealCharacteristicId || undefined,
    };

    try {
      await nestServerMealPlanApi.update(id, mealPlanData);
      revalidatePath('/cabinet/plans');
      return toFormState('SUCCESS', 'Meal plan updated successfully');
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
