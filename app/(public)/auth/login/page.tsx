'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, TextField, Paper, Typography, Box, Container, Alert } from '@mui/material';
import { useLoginWithRedirect } from '@/hooks/useAuthWithRedirect';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const passwordReset = searchParams.get('passwordReset');
  const { mutateAsync: login, error, isPending, isError } = useLoginWithRedirect();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (registered === 'true') {
      setSuccessMessage('Registration successful! Please log in with your new account.');
    } else if (passwordReset === 'true') {
      setSuccessMessage('Password reset successful! Please log in with your new password.');
    }
  }, [registered, passwordReset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    await login(formData);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
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
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isPending}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={isPending}
            />

            <Box mt={2} mb={3} textAlign="right">
              <Link href="/auth/forgot-password">
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Log In'}
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