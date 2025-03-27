'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { Button, TextField, Paper, Typography, Box, Container, Alert } from '@mui/material';
import { registerAction, RegisterValidationResult } from '@/actions/auth.actions';
import { EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import { useRegisterWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useEffect, useRef } from 'react';

const initialState: RegisterValidationResult = {
  success: false,
  data: null,
  formState: EMPTY_FORM_STATE,
};

export default function RegisterPage() {
  const processedDataRef = useRef<Record<string, string> | null>(null);
  const [validationResult, action, pending] = useFormState(registerAction, initialState);
  const { formState } = validationResult;
  const formRef = useFormReset(formState);
  const { mutateAsync: register, isPending, errorMessage } = useRegisterWithRedirect();

  useEffect(() => {
    if (
      validationResult.success &&
      validationResult.data &&
      !isPending &&
      JSON.stringify(processedDataRef.current) !== JSON.stringify(validationResult.data)
    ) {
      processedDataRef.current = validationResult.data;
      register(validationResult.data);
    }
  }, [validationResult, register, isPending]);

  useEffect(() => {
    if (errorMessage) {
      processedDataRef.current = null;
    }
  }, [errorMessage]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an Account
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <form action={action} ref={formRef}>
            <TextField
              label="First Name"
              type="text"
              name="firstName"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.firstName)}
              helperText={formState.fieldErrors?.firstName?.[0]}
              autoFocus
              disabled={isPending || pending}
            />

            <TextField
              label="Last Name"
              type="text"
              name="lastName"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.lastName)}
              helperText={formState.fieldErrors?.lastName?.[0]}
              disabled={isPending || pending}
            />

            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.email)}
              helperText={formState.fieldErrors?.email?.[0]}
              disabled={isPending || pending}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.password)}
              helperText={formState.fieldErrors?.password?.[0]}
              disabled={isPending || pending}
            />

            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.confirmPassword)}
              helperText={formState.fieldErrors?.confirmPassword?.[0]}
              disabled={isPending || pending}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5, mt: 3 }}
              disabled={isPending || pending}
            >
              {isPending || pending ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body1">
              Already have an account?{' '}
              <Link href="/auth/login">
                <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                  Log In
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
