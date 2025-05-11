import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { IAiDayPlan, IAiMeal, IAiIngredient, EMealType } from '../../types/meal-plan.types';
import moment from 'moment';

interface DayPlanDetailViewProps {
  dayPlan: IAiDayPlan;
}

const formatMealType = (mealType: EMealType): string => {
  const mealTypeMap: Record<EMealType, string> = {
    [EMealType.BREAKFAST]: 'Breakfast',
    [EMealType.LUNCH]: 'Lunch',
    [EMealType.DINNER]: 'Dinner',
    [EMealType.SNACK]: 'Snack',
  };
  return mealTypeMap[mealType];
};

const NutritionProgressBar = ({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value}g
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
};

const MealCard = ({ meal }: { meal: IAiMeal }) => {
  const { name, description, nutrition, recipe, tags, mealType } = meal;
  const totalTime = recipe.preparationTime + recipe.cookingTime;

  return (
    <Card
      sx={{ mb: 3, borderRadius: 2, overflow: 'visible', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 1, color: '#4f46e5' }} />
            <Typography variant="h6">
              {formatMealType(mealType)}: {name}
            </Typography>
          </Box>
        }
        sx={{
          pb: 1,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
        }}
      />

      <CardContent>
        <Typography variant="body1" paragraph>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Prep: {recipe.preparationTime} min | Cook: {recipe.cookingTime} min | Total: {totalTime}{' '}
            min
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: 1,
                fontWeight: 'medium',
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Ingredients
            </Typography>
            <List dense disablePadding>
              {recipe.ingredients.map((ingredient: IAiIngredient, index: number) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Nutrition
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" color="#4f46e5" fontWeight="bold">
                  {nutrition.calories} calories
                </Typography>
              </Box>
              <NutritionProgressBar
                label="Protein"
                value={nutrition.protein}
                max={50}
                color="#0088FE"
              />
              <NutritionProgressBar
                label="Carbs"
                value={nutrition.carbs}
                max={150}
                color="#00C49F"
              />
              <NutritionProgressBar label="Fat" value={nutrition.fat} max={65} color="#FFBB28" />
            </Box>
          </Grid>
        </Grid>

        <Accordion
          sx={{
            mt: 2,
            boxShadow: 'none',
            '&:before': { display: 'none' },
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8f9fa' }}>
            <Typography fontWeight="medium">Cooking Instructions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {recipe.instructions.map((instruction, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          variant="body2"
                          sx={{ mr: 1, fontWeight: 'bold', minWidth: '24px' }}
                        >
                          {index + 1}.
                        </Typography>
                        <Typography variant="body2">{instruction}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

const DayPlanDetailView: React.FC<DayPlanDetailViewProps> = ({ dayPlan }) => {
  const { dayNumber, date, totalNutrition, meals } = dayPlan;

  const formattedDate = date ? moment(new Date(date)).format('MMMM d, yyyy') : `Day ${dayNumber}`;

  // Sort meals by meal type in a logical order
  const mealOrder = {
    [EMealType.BREAKFAST]: 1,
    [EMealType.LUNCH]: 2,
    [EMealType.SNACK]: 3,
    [EMealType.DINNER]: 4,
  };
  const sortedMeals = [...meals].sort((a, b) => {
    return mealOrder[a.mealType] - mealOrder[b.mealType];
  });

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      <Paper sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {formattedDate}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Daily Nutrition Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {totalNutrition.calories}
                </Typography>
                <Typography variant="subtitle1">Calories</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="#0088FE">
                  {totalNutrition.protein}g
                </Typography>
                <Typography variant="subtitle1">Protein</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="#00C49F">
                  {totalNutrition.carbs}g
                </Typography>
                <Typography variant="subtitle1">Carbs</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="#FFBB28">
                  {totalNutrition.fat}g
                </Typography>
                <Typography variant="subtitle1">Fat</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {sortedMeals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </Paper>
    </Box>
  );
};

export { DayPlanDetailView };
