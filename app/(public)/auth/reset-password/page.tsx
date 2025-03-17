'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, TextField, Paper, Typography, Box, Container, Alert, CircularProgress } from '@mui/material';
import { useNewPassword } from '@/api/query/auth/auth.query';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { mutate: setNewPassword, isPending, error, isError } = useNewPassword();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    // Simple token validation - check if token exists
    // In a real-world scenario, you would validate the token on the server
    if (!token) {
      setIsValidatingToken(false);
      return;
    }

    // Simulate token validation - in reality, this would be a server-side check
    setTimeout(() => {
      setIsTokenValid(true);
      setIsValidatingToken(false);
    }, 1000);
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setNewPassword({
      token: token as string,
      password: formData.password,
    }, {
      onSuccess: () => {
        // Instead of showing success state, redirect to login page
        router.push('/auth/login?passwordReset=true');
      },
      onError: (error) => {
        console.error('Reset password error:', error);
      }
    });
  };

  if (isValidatingToken) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Validating your request...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!token || !isTokenValid) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Invalid or Expired Link
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              This password reset link is invalid or has expired.
            </Alert>
            <Typography paragraph>
              Please request a new password reset link or contact support if you continue having issues.
            </Typography>
            <Box mt={3} textAlign="center">
              <Link href="/auth/forgot-password">
                <Button variant="contained" color="primary">
                  Request New Link
                </Button>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reset Password
          </Typography>

          <>
            <Typography paragraph>
              Please create a new password for your account.
            </Typography>

            {isError && error instanceof Error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                autoFocus
                disabled={isPending}
              />

              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                disabled={isPending}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ py: 1.5, mt: 3 }}
                disabled={isPending}
              >
                {isPending ? 'Updating Password...' : 'Reset Password'}
              </Button>
            </form>
          </>
        </Paper>
      </Box>
    </Container>
  );
} 