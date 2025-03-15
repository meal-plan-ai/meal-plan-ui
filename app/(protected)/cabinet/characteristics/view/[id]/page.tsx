'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { getCharacteristicById, deleteCharacteristic } from '../../actions';
import { NutritionCharacteristics } from '@/lib/generateCharacteristics';

export default function ViewCharacteristicsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<NutritionCharacteristics | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const data = await getCharacteristicById(id);
        if (data) {
          setPlan(data);
        } else {
          console.error('Plan not found');
          router.push('/cabinet/characteristics');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [id, router]);

  const handleBackClick = () => {
    router.push('/cabinet/characteristics');
  };

  const handleEditClick = () => {
    router.push(`/cabinet/characteristics/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteCharacteristic(id);
      if (result.success) {
        router.push('/cabinet/characteristics');
      } else {
        console.error('Error deleting plan:', result.error);
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Convert activity level to readable format
  const formatActivityLevel = (level: string) => {
    switch (level) {
      case 'sedentary':
        return 'Sedentary (little to no exercise)';
      case 'light':
        return 'Light (light exercise 1-3 days/week)';
      case 'moderate':
        return 'Moderate (moderate exercise 3-5 days/week)';
      case 'active':
        return 'Active (hard exercise 6-7 days/week)';
      case 'veryActive':
        return 'Very Active (very hard exercise & physical job)';
      default:
        return level;
    }
  };

  // Convert goal to readable format
  const formatGoal = (goal: string) => {
    switch (goal) {
      case 'lose':
        return 'Weight Loss';
      case 'maintain':
        return 'Weight Maintenance';
      case 'gain':
        return 'Weight Gain';
      default:
        return goal;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Error: Plan not found
        </Typography>
        <Button variant="contained" onClick={handleBackClick} sx={{ mt: 2 }}>
          Return to List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {plan.name}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Plan Created
                </Typography>
                <Typography variant="body1">{formatDate(plan.createdAt)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body1">{formatDate(plan.updatedAt)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Weight
                </Typography>
                <Typography variant="h6">{plan.weight} kg</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Height
                </Typography>
                <Typography variant="h6">{plan.height} cm</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Age
                </Typography>
                <Typography variant="h6">{plan.age} years</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Activity Level
                </Typography>
                <Typography variant="body1">{formatActivityLevel(plan.activityLevel)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Goal
                </Typography>
                <Typography variant="body1">{formatGoal(plan.goal)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Nutrition Targets
        </Typography>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Daily Caloric Target
            </Typography>
            <Typography variant="h4" color="primary.main">
              {plan.caloriesTarget} kcal
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="subtitle1" gutterBottom>
          Macronutrient Distribution
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Protein
                </Typography>
                <Typography variant="h6">{plan.macroDistribution.protein}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((plan.caloriesTarget * (plan.macroDistribution.protein / 100)) / 4)} g
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Carbohydrates
                </Typography>
                <Typography variant="h6">{plan.macroDistribution.carbs}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((plan.caloriesTarget * (plan.macroDistribution.carbs / 100)) / 4)} g
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Fat
                </Typography>
                <Typography variant="h6">{plan.macroDistribution.fat}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((plan.caloriesTarget * (plan.macroDistribution.fat / 100)) / 9)} g
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Meal Frequency
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Meals Per Day
                  </Typography>
                  <Typography variant="h6">{plan.mealsPerDay}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Snacks
                  </Typography>
                  <Typography variant="h6">
                    {plan.includingSnacks ? 'Included' : 'Not Included'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Specific Nutritional Requirements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Fiber
                  </Typography>
                  <Typography variant="h6">{plan.nutrientTargets.fiber} g</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Sugar
                  </Typography>
                  <Typography variant="h6">{plan.nutrientTargets.sugar} g</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Sodium
                  </Typography>
                  <Typography variant="h6">{plan.nutrientTargets.sodium} mg</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Vitamins & Minerals Focus
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {plan.vitaminsAndMinerals.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name} (${item.priority})`}
                  color={
                    item.priority === 'high'
                      ? 'primary'
                      : item.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                />
              ))}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Dietary Restrictions & Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredients to Avoid
            </Typography>

            {plan.avoidIngredients.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No specific ingredients to avoid.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {plan.avoidIngredients.map((ingredient, index) => (
                  <Chip key={index} label={ingredient} color="error" />
                ))}
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Additional Preferences
            </Typography>

            <Grid container spacing={2}>
              {Object.entries(plan.preferences).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Chip
                    label={`${key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                      return str.toUpperCase();
                    })}`}
                    color={value ? 'success' : 'default'}
                    variant={value ? 'filled' : 'outlined'}
                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
