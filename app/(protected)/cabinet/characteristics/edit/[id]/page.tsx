'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { updateCharacteristic } from '../../actions';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import MealCharacteristicsForm from '@/components/organisms/MealCharacteristicsForm';
import {
  useMealCharacteristic,
  useUpdateMealCharacteristic,
} from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';

const initialState: FormState = EMPTY_FORM_STATE;

export default function EditCharacteristicsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [redirecting, setRedirecting] = useState(false);

  const {
    data: characteristicData,
    isLoading,
    isError,
    error: fetchError,
  } = useMealCharacteristic(id);

  const updateMutation = useUpdateMealCharacteristic(id);

  const [formState, action, isPending] = useActionState(
    (prevState: FormState, formData: FormData) => updateCharacteristic(prevState, formData, id),
    initialState
  );
  const formRef = useFormReset(formState);

  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);

      const timer = setTimeout(() => {
        router.push('/cabinet/characteristics');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formState.status, redirecting, router]);

  const handleCancel = useCallback(() => {
    router.push('/cabinet/characteristics');
  }, [router]);

  if (isError) {
    const errorMessage =
      fetchError instanceof Error ? fetchError.message : 'An unknown error occurred';
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">Failed to load the characteristic: {errorMessage}</Alert>
        <Button
          variant="outlined"
          onClick={handleCancel}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  // Show loading state from React Query
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Nutrition Plan
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
        >
          Back to List
        </Button>
      </Box>

      {formState.status === 'SUCCESS' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Nutrition plan updated successfully! Redirecting...
        </Alert>
      )}

      {formState.status === 'ERROR' && formState.message && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formState.message}
        </Alert>
      )}

      {updateMutation.isPending && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Updating nutrition plan...
        </Alert>
      )}

      {characteristicData && (
        <MealCharacteristicsForm
          isEditMode={true}
          initialData={characteristicData}
          formState={formState}
          isPending={isPending || redirecting || updateMutation.isPending}
          action={action}
          formRef={formRef}
          onCancel={handleCancel}
          submitButtonText="Update Plan"
        />
      )}
    </Box>
  );
}
