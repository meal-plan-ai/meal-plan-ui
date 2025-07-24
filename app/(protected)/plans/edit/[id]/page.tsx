'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { useMealPlan, mealPlanKeys } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { updateMealPlan } from '../../actions';
import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const initialState: FormState = EMPTY_FORM_STATE;

export default function EditMealPlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [redirecting, setRedirecting] = useState(false);

  const updateMealPlanWithId = useCallback(
    (state: FormState, formData: FormData) => updateMealPlan(state, formData, id as string),
    [id]
  );

  const [formState, action, isPending] = useActionState(updateMealPlanWithId, initialState);
  const formRef = useFormReset(formState);

  const { data: mealPlan, isLoading: loadingData } = useMealPlan(id as string);
  const { data: characteristicsData, isLoading: loadingCharacteristics } = useMealCharacteristics();

  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);
      toast.success('Meal plan updated successfully');

      // Invalidate meal plans queries to refresh the list
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.all });

      router.push('/plans');
    }
  }, [formState.status, redirecting, router, queryClient]);

  const handleCancel = useCallback(() => {
    router.push('/plans');
  }, [router]);

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mb: 2 }}>
          Back to Plans
        </Button>
        <Typography variant="h4" component="h1">
          Edit Meal Plan
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
              defaultValue={mealPlan?.name}
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
              defaultValue={mealPlan?.durationInDays}
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
                defaultValue={mealPlan?.mealCharacteristicId ?? ''}
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
                  characteristicsData?.data.map(characteristic => (
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
                  {isPending ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
