'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { Button, TextField, Paper, Typography, Box, Container } from '@mui/material';
import { loginAction, ValidationResult } from '@/actions/auth.actions';
import { EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import { useLoginWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useEffect, useRef } from 'react';

const initialState: ValidationResult = {
  success: false,
  data: null,
  formState: EMPTY_FORM_STATE,
};

export default function LoginPage() {
  const processedDataRef = useRef<Record<string, string> | null>(null);
  const [validationResult, action, pending] = useFormState(loginAction, initialState);
  const { formState } = validationResult;
  const formRef = useFormReset(formState);
  const { mutateAsync: login, isPending, errorMessage } = useLoginWithRedirect();

  useEffect(() => {
    if (
      validationResult.success &&
      validationResult.data &&
      !isPending &&
      JSON.stringify(processedDataRef.current) !== JSON.stringify(validationResult.data)
    ) {
      processedDataRef.current = validationResult.data;
      login(validationResult.data);
    }
  }, [validationResult, login, isPending]);

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
            Login
          </Typography>
          <form action={action} ref={formRef}>
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(formState.fieldErrors?.email)}
              helperText={formState.fieldErrors?.email?.[0]}
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
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
              disabled={isPending || pending}
            >
              {isPending || pending ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body1">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register">
                <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                  Register
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
