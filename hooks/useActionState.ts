'use client';

import { useState, useTransition, useCallback } from 'react';
import { FormState } from '@/utils/form-state';

/**
 * A hook to handle server action state management.
 * Provides state management for server actions, together with a wrapped action function
 * that handles form submission and state updates.
 *
 * @param action The server action function that processes form data
 * @param initialState The initial form state
 * @returns [formState, actionWrapper, isPending] tuple
 */
export function useActionState<T extends unknown[]>(
  action: (state: FormState, ...args: T) => Promise<FormState>,
  initialState: FormState
) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();

  const actionWrapper = useCallback(
    async (...args: T) => {
      startTransition(async () => {
        const result = await action(formState, ...args);
        setFormState(result);
      });
    },
    [action, formState]
  );

  return [formState, actionWrapper, isPending] as const;
}

export default useActionState;
