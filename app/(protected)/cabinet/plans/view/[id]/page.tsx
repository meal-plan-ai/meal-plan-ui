'use client';

import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useMealPlan, useGenerateAiPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import { IMealCharacteristic } from '@/api/nest-server-api';
import { use } from 'react';

// Client-side component for interactive elements
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
      <Link href={`/cabinet/plans/edit/${id}`} passHref>
        <Button variant="contained" color="primary" startIcon={<EditIcon />}>
          Edit Plan
        </Button>
      </Link>
    </>
  );
};

// Client component wrapper for data fetching
function MealPlanContent({ id }: { id: string }) {
  const { data: mealPlan, isLoading: loading, error: fetchError } = useMealPlan(id);
  const { data: characteristicsData, isLoading: loadingAllCharacteristics } =
    useMealCharacteristics();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Find meal characteristic
  let mealCharacteristic: IMealCharacteristic | null = null;
  if (mealPlan?.mealCharacteristicId && characteristicsData?.data) {
    mealCharacteristic =
      characteristicsData.data.find(
        (c: { id: string }) => c.id === mealPlan.mealCharacteristicId
      ) || null;
  }

  if (loading || loadingAllCharacteristics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError || !mealPlan) {
    return (
      <Box>
        <Link href="/cabinet/plans" passHref>
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
        <Link href="/cabinet/plans" passHref>
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plan Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{mealPlan.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">{mealPlan.durationInDays} days</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">{formatDate(mealPlan.createdAt)}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Modified
                  </Typography>
                  <Typography variant="body1">{formatDate(mealPlan.updatedAt)}</Typography>
                </Grid>

                {mealPlan.userId && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {mealPlan.userId}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {mealCharacteristic && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Linked Meal Characteristic
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Characteristic Name
                    </Typography>
                    <Typography variant="body1">{mealCharacteristic.planName}</Typography>
                  </Grid>

                  {mealCharacteristic.gender && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1">{mealCharacteristic.gender}</Typography>
                    </Grid>
                  )}

                  {mealCharacteristic.targetDailyCalories && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Target Daily Calories
                      </Typography>
                      <Typography variant="body1">
                        {mealCharacteristic.targetDailyCalories} kcal
                      </Typography>
                    </Grid>
                  )}

                  {mealCharacteristic.activityLevel && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Activity Level
                      </Typography>
                      <Typography variant="body1">{mealCharacteristic.activityLevel}</Typography>
                    </Grid>
                  )}

                  {mealCharacteristic.goal && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Goal
                      </Typography>
                      <Typography variant="body1">{mealCharacteristic.goal}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default function ViewMealPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <MealPlanContent id={id} />;
}
