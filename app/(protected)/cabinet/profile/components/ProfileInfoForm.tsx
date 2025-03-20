'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import { profileInfoAction, ProfileValidationResult } from '@/actions/profile.actions';
import { useProfile, useUpdateProfile } from '@/api/query/profile/profile.query';
import { EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import toast from 'react-hot-toast';
import { UpdateProfileDto } from '@/api/query/profile/profile.dto';

const initialState: ProfileValidationResult = {
  success: false,
  data: null,
  formState: EMPTY_FORM_STATE
};

export default function ProfileInfoForm() {
  const { data: profile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [validationResult, action, isPending] = useFormState(profileInfoAction, initialState);
  const { formState } = validationResult;
  const formRef = useFormReset(formState);
  const updateProfileMutation = useUpdateProfile();
  const processedDataRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (validationResult.success &&
      validationResult.data &&
      !updateProfileMutation.isPending &&
      JSON.stringify(processedDataRef.current) !== JSON.stringify(validationResult.data)) {

      processedDataRef.current = validationResult.data;

      const updateData: UpdateProfileDto = {
        id: profile?.id ?? '',
        firstName: validationResult.data.firstName,
        lastName: validationResult.data.lastName,
      };

      updateProfileMutation.mutate(updateData, {
        onSuccess: () => {
          toast.success('Profile updated successfully');
          setEditMode(false);
        },
        onError: (error) => {
          toast.error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    }
  }, [validationResult, updateProfileMutation, profile]);

  const handleCancel = () => {
    setEditMode(false);
    processedDataRef.current = null;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Profile Information
        </Typography>
        <Box>
          {!editMode ? (
            <Button variant="outlined" color="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={isPending || updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="profile-form"
                variant="contained"
                color="primary"
                disabled={isPending || updateProfileMutation.isPending}
              >
                {isPending || updateProfileMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form id="profile-form" action={action} ref={formRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              defaultValue={profile?.firstName || ''}
              fullWidth
              disabled={!editMode || isPending || updateProfileMutation.isPending}
              required
              margin="normal"
              error={Boolean(formState.fieldErrors?.firstName)}
              helperText={formState.fieldErrors?.firstName?.[0]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              defaultValue={profile?.lastName || ''}
              fullWidth
              disabled={!editMode || isPending || updateProfileMutation.isPending}
              required
              margin="normal"
              error={Boolean(formState.fieldErrors?.lastName)}
              helperText={formState.fieldErrors?.lastName?.[0]}
            />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
