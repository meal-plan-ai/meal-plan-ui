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
  Avatar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {
  IAiDayPlan,
  IAiMeal,
  IAiIngredient,
} from '../../../meal-plan-server/src/modules/ai-meal-generator/entities/ai-generated-meal-plan.interface';
import moment from 'moment';

interface DayPlanDetailViewProps {
  dayPlan: IAiDayPlan;
}

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
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {name}
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
  const mealOrder = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };
  const sortedMeals = [...meals].sort((a, b) => {
    return (
      mealOrder[a.mealType as keyof typeof mealOrder] -
      mealOrder[b.mealType as keyof typeof mealOrder]
    );
  });

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          p: 2,
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={{ xs: 2, sm: 0 }}>
          <Avatar
            sx={{
              bgcolor: '#4f46e5',
              width: 48,
              height: 48,
            }}
          >
            <RestaurantIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              {formattedDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day {dayNumber} Meal Plan
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Daily meal plan with {sortedMeals.length} meals
        </Typography>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 2,
          bgcolor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <RestaurantIcon sx={{ color: '#4f46e5', mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            Daily Nutrition Summary
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="#4f46e5" gutterBottom>
                {totalNutrition.calories} calories
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Protein
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {totalNutrition.protein}g
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Carbs
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {totalNutrition.carbs}g
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Fat
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {totalNutrition.fat}g
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
              }}
            >
              <NutritionProgressBar
                label="Protein"
                value={totalNutrition.protein}
                max={150}
                color="#0088FE"
              />
              <NutritionProgressBar
                label="Carbs"
                value={totalNutrition.carbs}
                max={300}
                color="#00C49F"
              />
              <NutritionProgressBar
                label="Fat"
                value={totalNutrition.fat}
                max={100}
                color="#FFBB28"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 2,
          bgcolor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <RestaurantIcon sx={{ color: '#4f46e5', mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            Your Meals for Today
          </Typography>
        </Box>

        {sortedMeals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </Paper>
    </Box>
  );
};

export default DayPlanDetailView;
