'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Grid,
  Alert,
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createMealPlan } from '../actions';
import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import toast from 'react-hot-toast';

const initialState: FormState = EMPTY_FORM_STATE;

export default function CreateMealPlanPage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const [formState, action, isPending] = useActionState(createMealPlan, initialState);
  const formRef = useFormReset(formState);

  const { data: mealCharacteristics, isLoading: loadingCharacteristics } = useMealCharacteristics();

  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);
      toast.success('Meal plan created successfully');
      router.push('/plans');
    }
  }, [formState.status, redirecting, router]);

  const handleCancel = useCallback(() => {
    router.push('/plans');
  }, [router]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mb: 2 }}>
          Back to Plans
        </Button>
        <Typography variant="h4" component="h1">
          Create New Meal Plan
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        {formState.status === 'ERROR' && formState.message && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formState.message}
          </Alert>
        )}

        <form ref={formRef} action={action}>
          <Stack spacing={3}>
            <TextField
              label="Plan Name"
              name="name"
              fullWidth
              error={!!formState.fieldErrors?.name}
              helperText={formState.fieldErrors?.name?.[0]}
              disabled={isPending}
              required
            />

            <TextField
              label="Duration (days)"
              name="durationInDays"
              type="number"
              fullWidth
              defaultValue={7}
              error={!!formState.fieldErrors?.durationInDays}
              helperText={formState.fieldErrors?.durationInDays?.[0]}
              inputProps={{ min: 1 }}
              disabled={isPending}
              required
            />

            <FormControl fullWidth disabled={isPending || loadingCharacteristics}>
              <InputLabel id="meal-characteristic-label">Meal Characteristic</InputLabel>
              <Select
                labelId="meal-characteristic-label"
                name="mealCharacteristicId"
                defaultValue=""
                label="Meal Characteristic"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {loadingCharacteristics ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} sx={{ mx: 'auto' }} />
                  </MenuItem>
                ) : (
                  mealCharacteristics?.data.map(characteristic => (
                    <MenuItem key={characteristic.id} value={characteristic.id}>
                      {characteristic.planName}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>Optional: Link this plan to a meal characteristic</FormHelperText>
            </FormControl>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" onClick={handleCancel} disabled={isPending}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isPending}
                >
                  {isPending ? <CircularProgress size={24} /> : 'Create Plan'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
