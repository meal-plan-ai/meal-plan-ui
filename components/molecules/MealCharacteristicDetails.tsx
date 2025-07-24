'use client';

import { IMealCharacteristic } from '@/api/nest-server-api';
import { Divider, Grid, Typography, CardContent, Card, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const MealCharacteristicDetails = ({
  mealCharacteristic,
}: {
  mealCharacteristic: IMealCharacteristic;
}) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/characteristics/view/${mealCharacteristic.id}`);
  }, [router, mealCharacteristic.id]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Characteristic:
          </Typography>
          <Button variant="contained" color="primary" onClick={onClick}>
            View details
          </Button>
        </Box>
        <Divider sx={{ m: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Characteristic Name
            </Typography>
            <Typography variant="body1">{mealCharacteristic.planName}</Typography>
          </Grid>

          {mealCharacteristic.targetDailyCalories && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Target Daily Calories
              </Typography>
              <Typography variant="body1">{mealCharacteristic.targetDailyCalories} kcal</Typography>
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
  );
};

export { MealCharacteristicDetails };
