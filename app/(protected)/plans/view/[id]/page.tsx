'use client';

import Link from 'next/link';
import { Box, Typography, Button, Alert, Grid, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useMealPlan, useGenerateAiPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { use } from 'react';
import { PlanDetails, MealCharacteristicDetails, PlanScheduleView } from '@/components';
import { useTheme } from '@/contexts';

const GenerateButton = ({ id }: { id: string }) => {
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
        Generate AI Plan
      </Button>
    </>
  );
};

function MealPlanContent({ id }: { id: string }) {
  const { theme } = useTheme();
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
        <Typography variant="h4" component="h1">
          Nutrition Profile: {mealPlan.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PlanDetails mealPlan={mealPlan} />
        </Grid>

        {mealPlan?.mealCharacteristic && (
          <Grid item xs={12} md={6}>
            <MealCharacteristicDetails mealCharacteristic={mealPlan?.mealCharacteristic} />
          </Grid>
        )}
      </Grid>

      {/* CTA: Generate AI Plan if not present */}
      {!mealPlan?.aiGeneratedMealPlan && (
        <Box
          sx={{
            p: 4,
            my: 4,
            borderRadius: 3,
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Generate Your AI Meal Plan!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            You’ve set up your nutrition profile and selected the number of days for your plan. Now,
            click the button below and let our AI create a personalized meal plan for you—tailored
            to your goals, preferences, and restrictions.
          </Typography>
          <GenerateButton id={mealPlan.id} />
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            When you click the button, we’ll generate your meal plan on the server.
          </Typography>
        </Box>
      )}

      {mealPlan?.aiGeneratedMealPlan && <PlanScheduleView mealPlan={mealPlan} />}
    </Box>
  );
}

export default function ViewMealPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <MealPlanContent id={id} />;
}
