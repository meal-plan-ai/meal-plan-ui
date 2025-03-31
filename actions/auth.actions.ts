'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';
import { nestServerAuthApi } from '@/api/nest-server-api';
import { cookies } from 'next/headers';

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
  redirectUrl: string;
  data: { email: string; password: string } | null;
  formState: FormState;
};

export type RegisterValidationResult = {
  success: boolean;
  redirectUrl: string;
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

    try {
      await nestServerAuthApi.login(validatedData);

      const cookieStore = await cookies();

      cookieStore.set('isAuthenticated', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return {
        success: true,
        redirectUrl: '/cabinet',
        data: validatedData,
        formState: toFormState('SUCCESS', 'Login successful'),
      };
    } catch (apiError) {
      console.error('Login API error:', apiError);
      return {
        success: false,
        redirectUrl: '',
        data: null,
        formState: toFormState('ERROR', 'Login failed. Please check your credentials.'),
      };
    }
  } catch (validationError) {
    return {
      success: false,
      redirectUrl: '',
      data: null,
      formState: fromErrorToFormState(validationError),
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

    try {
      await nestServerAuthApi.register(userData);

      return {
        success: true,
        redirectUrl: '/cabinet',
        data: userData,
        formState: toFormState('SUCCESS', 'Registration successful'),
      };
    } catch (apiError) {
      console.error('Registration API error:', apiError);
      return {
        success: false,
        redirectUrl: '',
        data: null,
        formState: toFormState('ERROR', 'Registration failed. Please try again.'),
      };
    }
  } catch (validationError) {
    return {
      success: false,
      redirectUrl: '',
      data: null,
      formState: fromErrorToFormState(validationError),
    };
  }
}
