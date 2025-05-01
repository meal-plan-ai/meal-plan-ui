'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createCharacteristic } from '../actions';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import toast from 'react-hot-toast';
import { MealCharacteristicsForm } from '@/components/organisms/MealCharacteristicsForm';
const initialState: FormState = EMPTY_FORM_STATE;

export default function CreateCharacteristicsPage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const [formState, action, isPending] = useActionState(createCharacteristic, initialState);
  const formRef = useFormReset(formState);

  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);
      toast.success('Nutrition plan created successfully');
      router.push('/characteristics');
    }
  }, [formState.status, redirecting, router]);

  const handleCancel = useCallback(() => {
    router.push('/characteristics');
  }, [router]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create New Nutrition Plan
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
          Nutrition plan created successfully! Redirecting...
        </Alert>
      )}

      {formState.status === 'ERROR' && formState.message && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formState.message}
        </Alert>
      )}

      <MealCharacteristicsForm
        isEditMode={false}
        initialData={undefined}
        formState={formState}
        isPending={isPending || redirecting}
        action={action}
        formRef={formRef}
        onCancel={handleCancel}
      />
    </Box>
  );
}
