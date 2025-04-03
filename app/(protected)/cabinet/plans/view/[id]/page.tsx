'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useMealPlan } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import { IMealCharacteristic } from '@/api/nest-server-api';
import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';

interface ViewMealPlanPageProps {
  params: {
    id: string;
  };
}

export default function ViewMealPlanPage({ params }: ViewMealPlanPageProps) {
  const router = useRouter();
  const { id } = params;

  const { data: mealPlan, isLoading: loading, error: fetchError } = useMealPlan(id);
  const { data: characteristicsData, isLoading: loadingAllCharacteristics } =
    useMealCharacteristics();
  const [mealCharacteristic, setMealCharacteristic] = useState<IMealCharacteristic | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если план загружен и имеет ID характеристики, находим характеристику в полученных данных
    if (mealPlan?.mealCharacteristicId && characteristicsData?.data) {
      const characteristic = characteristicsData.data.find(
        c => c.id === mealPlan.mealCharacteristicId
      );
      if (characteristic) {
        setMealCharacteristic(characteristic);
      }
    }
  }, [mealPlan, characteristicsData]);

  // Обработка ошибок
  useEffect(() => {
    if (fetchError) {
      setError('Failed to load meal plan data. Please try again.');
    }
  }, [fetchError]);

  const handleBack = () => {
    router.push('/cabinet/plans');
  };

  const handleEdit = () => {
    router.push(`/cabinet/plans/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading || loadingAllCharacteristics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !mealPlan) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Plans
        </Button>
        <Alert severity="error">{error || 'Failed to load meal plan'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Plans
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {mealPlan.name}
          </Typography>
          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit Plan
          </Button>
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
