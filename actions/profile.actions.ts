'use server';

import { z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from '@/utils/form-state';

const profileInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ProfileValidationResult = {
  success: boolean;
  data: z.infer<typeof profileInfoSchema> | null;
  formState: FormState;
};

export type PasswordChangeValidationResult = {
  success: boolean;
  data: { currentPassword: string; password: string } | null;
  formState: FormState;
};

export async function profileInfoAction(
  prevState: ProfileValidationResult,
  formData: FormData
): Promise<ProfileValidationResult> {
  try {
    const validatedData = profileInfoSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone') || '',
      gender: formData.get('gender') || '',
      birthdate: formData.get('birthdate') || '',
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

export async function passwordChangeAction(
  prevState: PasswordChangeValidationResult,
  formData: FormData
): Promise<PasswordChangeValidationResult> {
  try {
    const rawData = {
      currentPassword: formData.get('currentPassword'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const validatedData = passwordChangeSchema.parse(rawData);

    return {
      success: true,
      data: {
        currentPassword: validatedData.currentPassword,
        password: validatedData.password,
      },
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
