'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, TextField, Paper, Typography, Box, Container, Alert } from '@mui/material';
import { useResetPassword } from '@/api/query/auth/auth.query';

export default function ForgotPasswordPage() {
  const { mutate: resetPassword, isPending, error, isError } = useResetPassword();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError('');
  };

  const validateEmail = () => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    resetPassword({ email }, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error) => {
        console.error('Reset password error:', error);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
          </Typography>

          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset instructions have been sent to your email.
              </Alert>
              <Typography paragraph>
                Please check your email for instructions on how to reset your password. If you don&apos;t see it in your inbox, please check your spam folder.
              </Typography>
              <Box mt={3} textAlign="center">
                <Link href="/auth/login">
                  <Button variant="contained" color="primary">
                    Return to Login
                  </Button>
                </Link>
              </Box>
            </Box>
          ) : (
            <>
              <Typography paragraph>
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </Typography>

              {validationError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {validationError}
                </Alert>
              )}

              {isError && error instanceof Error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error.message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={handleChange}
                  error={Boolean(validationError)}
                  helperText={validationError ? validationError : ' '}
                  autoFocus
                  disabled={isPending}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, mt: 2 }}
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Reset Password'}
                </Button>
              </form>

              <Box mt={3} textAlign="center">
                <Typography variant="body1">
                  <Link href="/auth/login">
                    <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                      Back to Login
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 