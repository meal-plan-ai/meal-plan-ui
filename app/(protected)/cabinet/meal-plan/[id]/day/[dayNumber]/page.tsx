'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DayPlanDetailView from '../../../../../../../components/templates/DayPlanDetailView';
import { IAiDayPlan } from '../../../../../../../../meal-plan-server/src/modules/ai-meal-generator/entities/ai-generated-meal-plan.interface';
import { useMealPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';

export default function DayPlanPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayPlan, setDayPlan] = useState<IAiDayPlan | null>(null);

  const id = params.id as string;
  const dayNumber = params.dayNumber ? parseInt(params.dayNumber as string, 10) : null;

  const { data: mealPlanData } = useMealPlan(id as string);

  useEffect(() => {
    async function loadData() {
      if (!dayNumber) {
        setError('Invalid day number');
        setLoading(false);
        return;
      }

      try {
        const foundDayPlan = mealPlanData?.aiGeneratedMealPlan?.generatedPlan.days.find(
          day => day.dayNumber === dayNumber
        );

        if (foundDayPlan) {
          setDayPlan(foundDayPlan);
        } else {
          setError(`Day ${dayNumber} not found in meal plan`);
        }
      } catch (err) {
        setError('Failed to load meal plan data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dayNumber, mealPlanData]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dayPlan) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Something went wrong'}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
        <Button variant="text" color="primary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back to Meal Plan
        </Button>
      </Box>

      <DayPlanDetailView dayPlan={dayPlan} />
    </Box>
  );
}
