'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField, Paper, Typography, Box, Container, Alert } from '@mui/material';
import { loginAction } from '@/actions/auth.actions';
import { EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';

const initialState = {
  success: false,
  redirectUrl: '',
  data: null,
  formState: EMPTY_FORM_STATE,
};

export default function LoginPage() {
  const router = useRouter();
  const [validationResult, action, pending] = useActionState(loginAction, initialState);
  const { formState } = validationResult;
  const formRef = useFormReset(formState);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (validationResult.success && validationResult.redirectUrl && !redirectedRef.current) {
      redirectedRef.current = true;
      router.push(validationResult.redirectUrl);
    }
  }, [validationResult, router]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>

          {formState.status === 'ERROR' && formState.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formState.message}
            </Alert>
          )}

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
              disabled={pending}
            >
              {pending ? 'Logging in...' : 'Log In'}
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
