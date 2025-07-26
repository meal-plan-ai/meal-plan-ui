'use client';

import Link from 'next/link';
import { Box, Typography, Button, Alert, Grid, CircularProgress } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useMealPlan, useGenerateAiPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { AiGenerationStatus } from '@/api/nest-server-api/meal-plan/meal-plan.types';
import { use } from 'react';
import { PlanDetails, MealCharacteristicDetails, PlanScheduleView } from '@/components';
import { useTheme } from '@/contexts';

const GenerateButton = ({
  id,
  aiGenerationStatus,
}: {
  id: string;
  aiGenerationStatus?: AiGenerationStatus;
}) => {
  const { mutate: generateAiPlan, isPending } = useGenerateAiPlan();

  const handleCreateAI = () => {
    generateAiPlan(id);
  };

  const isGenerating = aiGenerationStatus === AiGenerationStatus.IN_PROGRESS || isPending;
  const isFailed = aiGenerationStatus === AiGenerationStatus.FAILED;

  if (isGenerating) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body1" color="primary">
          Generating your AI meal plan...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color={isFailed ? 'error' : 'warning'}
        startIcon={isFailed ? <EditIcon /> : <EditIcon />}
        onClick={handleCreateAI}
        sx={{ mr: 2 }}
        disabled={isGenerating}
      >
        {isFailed ? 'Retry AI Plan Generation' : 'Generate AI Plan'}
      </Button>
      {isFailed && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
          Previous generation failed. Try again?
        </Typography>
      )}
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

  const isGenerating = mealPlan.aiGenerationStatus === AiGenerationStatus.IN_PROGRESS;
  const isCompleted = mealPlan.aiGenerationStatus === AiGenerationStatus.COMPLETED;
  const isFailed = mealPlan.aiGenerationStatus === AiGenerationStatus.FAILED;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Link href="/plans" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to Plans
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Meal Plan Name: {mealPlan.name}
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

      {/* Show generation status */}
      {isGenerating && (
        <Box
          sx={{
            p: 4,
            my: 4,
            borderRadius: 3,
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)'
                : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            boxShadow: 3,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={48} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            AI is Creating Your Meal Plan! 🤖
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Please wait while our AI generates a personalized meal plan based on your nutrition
            profile. This usually takes a few moments. You can safely refresh this page or come back
            later - we&apos;ll save your progress!
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            Generation in progress... The page will update automatically when complete.
          </Typography>
        </Box>
      )}

      {/* CTA: Generate AI Plan if not present and not generating */}
      {!isGenerating && !mealPlan?.aiGeneratedMealPlan && (
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
            ...(isFailed && {
              border: '2px solid',
              borderColor: 'error.main',
            }),
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {isFailed ? 'Generation Failed - Try Again' : 'Generate Your AI Meal Plan!'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            {isFailed
              ? 'Something went wrong during generation. Please try again to create your personalized meal plan.'
              : 'You&apos;ve set up your nutrition profile and selected the number of days for your plan. Now, click the button below and let our AI create a personalized meal plan for you—tailored to your goals, preferences, and restrictions.'}
          </Typography>
          <GenerateButton id={mealPlan.id} aiGenerationStatus={mealPlan.aiGenerationStatus} />
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            When you click the button, we&apos;ll generate your meal plan on the server.
          </Typography>
        </Box>
      )}

      {/* Show success message when completed */}
      {isCompleted && mealPlan?.aiGeneratedMealPlan && (
        <Box
          sx={{
            p: 3,
            my: 4,
            borderRadius: 3,
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)'
                : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            boxShadow: 3,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'success.main',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Your AI Meal Plan is Ready! ✨
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Scroll down to view your personalized meal schedule.
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
