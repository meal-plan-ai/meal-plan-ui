'use client';

import React from 'react';
import { Card, Typography, Box, Chip, Stack, Divider } from '@mui/material';
import { IAiDayPlan, IAiMeal, EMealType } from '../../types/meal-plan.types';
import { v4 as uuidv4 } from 'uuid';

interface DayPlanCardProps {
  dayPlan: IAiDayPlan;
  onClick?: () => void;
}

const MealTypeIcon = ({ mealType }: { mealType: EMealType }) => {
  const iconMap: Record<string, string> = {
    [EMealType.BREAKFAST]: '🍳',
    [EMealType.LUNCH]: '🍲',
    [EMealType.DINNER]: '🍽️',
    [EMealType.SNACK]: '🥨',
  };

  return <span>{iconMap[mealType] || '🍴'}</span>;
};

const formatMealType = (mealType: EMealType): string => {
  return mealType.toLowerCase().charAt(0).toUpperCase() + mealType.toLowerCase().slice(1);
};

const DayPlanCard: React.FC<DayPlanCardProps> = ({ dayPlan, onClick }) => {
  const { dayNumber, totalNutrition, meals } = dayPlan;

  return (
    <Card
      sx={{
        width: 200,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" align="center">
          Day {dayNumber}
        </Typography>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        {meals.map((meal: IAiMeal, index: number) => (
          <Box key={uuidv4()} sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              <MealTypeIcon mealType={meal.mealType} /> {formatMealType(meal.mealType)}
            </Typography>
            <Typography variant="body2" noWrap title={meal.name} sx={{ mb: 0.5 }}>
              {meal.name}
            </Typography>
            {index < meals.length - 1 && <Divider sx={{ mt: 1 }} />}
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 1.5, bgcolor: 'grey.100' }}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip
            size="small"
            label={`${totalNutrition.calories} cal`}
            color="primary"
            variant="outlined"
          />
          <Chip
            size="small"
            label={`${totalNutrition.protein}g prot`}
            color="secondary"
            variant="outlined"
          />
        </Stack>
      </Box>
    </Card>
  );
};

export { DayPlanCard };
