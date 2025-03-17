'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ValidationResult = {
  success: boolean;
  data: { email: string; password: string } | null;
  formState: FormState;
};

export async function loginAction(prevState: ValidationResult, formData: FormData): Promise<ValidationResult> {
  try {
    const validatedData = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    return {
      success: true,
      data: validatedData,
      formState: toFormState('SUCCESS', 'Validation successful')
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      formState: fromErrorToFormState(error)
    };
  }
} 