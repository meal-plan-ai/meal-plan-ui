'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { updateCharacteristic } from '../../actions';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import MealCharacteristicsForm from '@/components/organisms/MealCharacteristicsForm';
import { useMealCharacteristic } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import toast from 'react-hot-toast';
const initialState: FormState = EMPTY_FORM_STATE;

export default function EditCharacteristicsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [redirecting, setRedirecting] = useState(false);

  const {
    data: characteristicData,
    isLoading,
    isError,
    error: fetchError,
  } = useMealCharacteristic(id as string);

  const [formState, action, isPending] = useActionState(
    (prevState: FormState, formData: FormData) =>
      updateCharacteristic(prevState, formData, id as string),
    initialState
  );
  const formRef = useFormReset(formState);

  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);
      toast.success('Nutrition plan updated successfully');
      router.push('/characteristics');
    }
  }, [formState.status, redirecting, router]);

  const handleCancel = useCallback(() => {
    router.push('/characteristics');
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

      {isPending && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Updating nutrition plan...
        </Alert>
      )}

      {characteristicData && (
        <MealCharacteristicsForm
          isEditMode={true}
          initialData={characteristicData}
          formState={formState}
          isPending={isPending || redirecting}
          action={action}
          formRef={formRef}
          onCancel={handleCancel}
          submitButtonText="Update Plan"
        />
      )}
    </Box>
  );
}
