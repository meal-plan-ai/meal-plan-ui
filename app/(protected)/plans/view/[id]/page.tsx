'use client';

import Link from 'next/link';
import { Box, Typography, Button, Alert, Grid, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useMealPlan, useGenerateAiPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { use } from 'react';
import PlanDetails from '@/components/molecules/PlanDetails';
import MealCharacteristicDetails from '@/components/molecules/MealCharacteristicDetails';
import PlanScheduleView from '@/components/molecules/PlanScheduleView';

const ActionButtons = ({ id }: { id: string }) => {
  const { mutate: generateAiPlan } = useGenerateAiPlan();

  const handleCreateAI = () => {
    generateAiPlan(id);
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        startIcon={<EditIcon />}
        onClick={handleCreateAI}
        sx={{ mr: 2 }}
      >
        Create AI Plan
      </Button>
    </>
  );
};

function MealPlanContent({ id }: { id: string }) {
  const { data: mealPlan, isLoading: loading, error: fetchError } = useMealPlan(id);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError || !mealPlan) {
    return (
      <Box>
        <Link href="/plans" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to Plans
          </Button>
        </Link>
        <Alert severity="error">Failed to load meal plan</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Link href="/plans" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to Plans
          </Button>
        </Link>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {mealPlan.name}
          </Typography>
          <ActionButtons id={id} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PlanDetails mealPlan={mealPlan} />
        </Grid>

        {mealPlan?.mealCharacteristic && (
          <Grid item xs={12} md={6}>
            <MealCharacteristicDetails mealCharacteristic={mealPlan?.mealCharacteristic} />
          </Grid>
        )}
      </Grid>
      {mealPlan?.aiGeneratedMealPlan && <PlanScheduleView mealPlan={mealPlan} />}
    </Box>
  );
}

export default function ViewMealPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <MealPlanContent id={id} />;
}
