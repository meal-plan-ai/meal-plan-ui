'use client';

import { useActionState, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { updateCharacteristic } from '../../actions';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';
import { MealCharacteristicDto } from '@/api/query/meal-characteristics/meal-characteristics.dto';
import MealCharacteristicsForm from '@/components/organisms/MealCharacteristicsForm';

// Initial form state for validation
const initialState: FormState = EMPTY_FORM_STATE;

export default function EditCharacteristicsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [characteristicData, setCharacteristicData] = useState<MealCharacteristicDto | null>(null);

  // Setup form state with server validation action
  const [formState, action, isPending] = useActionState(
    (prevState: FormState, formData: FormData) => updateCharacteristic(prevState, formData, id),
    initialState
  );
  const formRef = useFormReset(formState);

  // Fetch the characteristic data by ID
  useEffect(() => {
    const fetchCharacteristic = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/meal-characteristics/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch characteristic data');
        }

        const data = await response.json();
        setCharacteristicData(data);
      } catch (error) {
        console.error('Error fetching characteristic:', error);
        setError('Failed to load the characteristic. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacteristic();
  }, [id]);

  // Check if submission was successful
  useEffect(() => {
    if (formState.status === 'SUCCESS' && !redirecting) {
      setRedirecting(true);
      // Redirect after a successful submission
      const timer = setTimeout(() => {
        router.push('/cabinet/characteristics');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formState.status, redirecting, router]);

  const handleCancel = useCallback(() => {
    router.push('/cabinet/characteristics');
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
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
