'use client';

import { Paper, Typography, Stack, CircularProgress, Alert, Box } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { useUserMealPlans } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { MealPlanCard, BlurOverlay, EmptyState } from '@/components';
import { useRouter } from 'next/navigation';

interface MealPlansSectionProps {
  onPlanClick: (id: string) => void;
  onCreateClick: () => void;
}

function MealPlansSection({ onPlanClick, onCreateClick }: MealPlansSectionProps) {
  const { data: mealPlans, isLoading, error } = useUserMealPlans();
  const router = useRouter();

  return (
    <Paper sx={{ p: 3, height: 350, overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssignmentIcon color="primary" />
        Meal Plans
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load meal plans</Alert>
      ) : mealPlans?.data && mealPlans.data.length > 0 ? (
        <Stack spacing={2} sx={{ maxHeight: 280, overflow: 'auto', pr: 1 }}>
          {mealPlans.data.slice(0, 3).map((plan, idx) =>
            idx === 2 ? (
              <BlurOverlay key={plan.id} onShowAll={() => router.push('/plans')}>
                <MealPlanCard key={plan.id} plan={plan} onClick={onPlanClick} />
              </BlurOverlay>
            ) : (
              <MealPlanCard key={plan.id} plan={plan} onClick={onPlanClick} />
            )
          )}
        </Stack>
      ) : (
        <EmptyState
          icon={<AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          title="No meal plans found"
          description="Create your first meal plan to get started"
          actionLabel="Create Plan"
          onAction={onCreateClick}
        />
      )}
    </Paper>
  );
}

export { MealPlansSection };
