'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { passwordChangeAction, PasswordChangeValidationResult } from '@/actions/profile.actions';
import { useNewPassword } from '@/api/query/auth/auth.query';
import { EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import toast from 'react-hot-toast';

const initialState: PasswordChangeValidationResult = {
  success: false,
  data: null,
  formState: EMPTY_FORM_STATE,
};

export default function PasswordChangeForm() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [validationResult, action, isPending] = useFormState(passwordChangeAction, initialState);
  const { formState } = validationResult;
  const formRef = useFormReset(formState);
  const passwordChangeMutation = useNewPassword();
  const processedDataRef = useRef<Record<string, string> | null>(null);

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(prev => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  useEffect(() => {
    if (
      validationResult.success &&
      validationResult.data &&
      !passwordChangeMutation.isPending &&
      JSON.stringify(processedDataRef.current) !== JSON.stringify(validationResult.data)
    ) {
      processedDataRef.current = validationResult.data;

      passwordChangeMutation.mutate(validationResult.data, {
        onSuccess: () => {
          setPasswordSuccess(true);
          toast.success('Password changed successfully');

          setTimeout(() => {
            setShowPasswordForm(false);
            setPasswordSuccess(false);
          }, 3000);
        },
        onError: error => {
          toast.error(
            `Password change failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        },
      });
    }
  }, [validationResult, passwordChangeMutation]);

  const handleCancel = () => {
    setShowPasswordForm(false);
    processedDataRef.current = null;
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Security
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {!showPasswordForm ? (
        <Button variant="outlined" color="primary" onClick={() => setShowPasswordForm(true)}>
          Change Password
        </Button>
      ) : (
        <Box sx={{ maxWidth: 500 }}>
          <Collapse in={passwordSuccess}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully!
            </Alert>
          </Collapse>

          <form id="password-form" action={action} ref={formRef}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              disabled={isPending || passwordChangeMutation.isPending}
              error={Boolean(formState.fieldErrors?.currentPassword)}
              helperText={formState.fieldErrors?.currentPassword?.[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={toggleCurrentPasswordVisibility}
                      edge="end"
                      disabled={isPending || passwordChangeMutation.isPending}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New Password"
              name="password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              disabled={isPending || passwordChangeMutation.isPending}
              error={Boolean(formState.fieldErrors?.password)}
              helperText={formState.fieldErrors?.password?.[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={toggleNewPasswordVisibility}
                      edge="end"
                      disabled={isPending || passwordChangeMutation.isPending}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              disabled={isPending || passwordChangeMutation.isPending}
              error={Boolean(formState.fieldErrors?.confirmPassword)}
              helperText={formState.fieldErrors?.confirmPassword?.[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={isPending || passwordChangeMutation.isPending}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={isPending || passwordChangeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending || passwordChangeMutation.isPending}
              >
                {isPending || passwordChangeMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </form>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" color="error">
          Danger Zone
        </Typography>
        <Button variant="outlined" color="error" sx={{ mt: 1 }}>
          Delete Account
        </Button>
      </Box>
    </Paper>
  );
}
