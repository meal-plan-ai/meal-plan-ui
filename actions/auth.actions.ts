'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginValidationResult = {
  success: boolean;
  data: { email: string; password: string } | null;
  formState: FormState;
};

export type RegisterValidationResult = {
  success: boolean;
  data: { firstName: string; lastName: string; email: string; password: string } | null;
  formState: FormState;
};

export async function loginAction(
  prevState: LoginValidationResult,
  formData: FormData
): Promise<LoginValidationResult> {
  try {
    const validatedData = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    return {
      success: true,
      data: validatedData,
      formState: toFormState('SUCCESS', 'Validation successful'),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      formState: fromErrorToFormState(error),
    };
  }
}

export async function registerAction(
  prevState: RegisterValidationResult,
  formData: FormData
): Promise<RegisterValidationResult> {
  try {
    const validatedData = registerSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = validatedData;

    return {
      success: true,
      data: userData,
      formState: toFormState('SUCCESS', 'Validation successful'),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      formState: fromErrorToFormState(error),
    };
  }
}
