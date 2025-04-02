'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  Paper,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  NoFood as NoFoodIcon,
  Spa as SpaIcon,
  Speed as SpeedIcon,
  LocalDining as LocalDiningIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  Height as HeightIcon,
  Scale as ScaleIcon,
} from '@mui/icons-material';
import {
  useMealCharacteristic,
  useDeleteMealCharacteristic,
} from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import {
  CookingComplexity,
  Gender,
  Goal,
} from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';
import { ActivityLevel } from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';

export default function ViewCharacteristicsPage() {
  const router = useRouter();
  const { id } = useParams();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const { data: plan, isLoading, isError, error: fetchError } = useMealCharacteristic(id as string);

  const deleteMutation = useDeleteMealCharacteristic();

  const handleBack = useCallback(() => {
    router.push('/cabinet/characteristics');
  }, [router]);

  const handleEdit = useCallback(() => {
    router.push(`/cabinet/characteristics/edit/${id}`);
  }, [router, id]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(id as string);
      router.push('/cabinet/characteristics');
    } catch (error) {
      console.error('Error deleting plan:', error);
      setError('Failed to delete the nutrition plan. Please try again later.');
    }
    setDeleteDialogOpen(false);
  }, [id, router, deleteMutation]);

  const activityLevelText = useMemo(() => {
    if (!plan?.activityLevel) return 'Not specified';

    switch (plan.activityLevel) {
      case ActivityLevel.SEDENTARY:
        return 'Sedentary (little to no exercise)';
      case ActivityLevel.LIGHT:
        return 'Light (light exercise 1-3 days/week)';
      case ActivityLevel.MODERATE:
        return 'Moderate (moderate exercise 3-5 days/week)';
      case ActivityLevel.ACTIVE:
        return 'Active (hard exercise 6-7 days/week)';
      case ActivityLevel.VERY_ACTIVE:
        return 'Very Active (very hard exercise & physical job)';
      default:
        return plan.activityLevel;
    }
  }, [plan?.activityLevel]);

  const goalText = useMemo(() => {
    if (!plan?.goal) return 'Not specified';

    switch (plan.goal) {
      case Goal.WEIGHT_LOSS:
        return 'Weight Loss';
      case Goal.MAINTENANCE:
        return 'Maintenance';
      case Goal.MUSCLE_GAIN:
        return 'Muscle Gain';
      default:
        return plan.goal;
    }
  }, [plan?.goal]);

  const genderText = useMemo(() => {
    if (!plan?.gender) return 'Not specified';

    switch (plan.gender) {
      case Gender.MALE:
        return 'Male';
      case Gender.FEMALE:
        return 'Female';
      case Gender.OTHER:
        return 'Other';
      default:
        return plan.gender;
    }
  }, [plan?.gender]);

  const complexityText = useMemo(() => {
    if (!plan?.cookingComplexity) return 'Not specified';

    switch (plan.cookingComplexity) {
      case CookingComplexity.QUICK:
        return 'Quick & Easy';
      case CookingComplexity.STANDARD:
        return 'Standard';
      case CookingComplexity.GOURMET:
        return 'Gourmet';
      default:
        return plan.cookingComplexity;
    }
  }, [plan?.cookingComplexity]);

  const macroGrams = useMemo(() => {
    if (!plan) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round(((plan.targetDailyCalories || 0) * (plan.proteinPercentage || 0)) / 400),
      carbs: Math.round(((plan.targetDailyCalories || 0) * (plan.carbsPercentage || 0)) / 400),
      fat: Math.round(((plan.targetDailyCalories || 0) * (plan.fatPercentage || 0)) / 900),
    };
  }, [plan]);

  const getActivityLevelColor = useMemo(() => {
    if (!plan?.activityLevel) return '#6c757d';

    switch (plan.activityLevel) {
      case ActivityLevel.SEDENTARY:
        return '#4299e1';
      case ActivityLevel.LIGHT:
        return '#4299e1';
      case ActivityLevel.MODERATE:
        return '#ed8936';
      case ActivityLevel.ACTIVE:
        return '#ed8936';
      case ActivityLevel.VERY_ACTIVE:
        return '#e53e3e';
      default:
        return '#3182ce';
    }
  }, [plan?.activityLevel]);

  const getGoalColor = useMemo(() => {
    if (!plan?.goal) return '#6c757d';

    switch (plan.goal) {
      case Goal.WEIGHT_LOSS:
        return '#e53e3e';
      case Goal.MAINTENANCE:
        return '#3182ce';
      case Goal.MUSCLE_GAIN:
        return '#38a169';
      default:
        return '#3182ce';
    }
  }, [plan?.goal]);

  if (isError) {
    const errorMessage =
      fetchError instanceof Error ? fetchError.message : 'An unknown error occurred';
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load the nutrition plan: {errorMessage}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
        <CircularProgress />
        <Typography>Loading nutrition plan details...</Typography>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No nutrition plan found with this ID.
      </Alert>
    );
  }

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
              {plan.planName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nutrition Plan Details
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ borderRadius: 2 }}
          >
            BACK
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ borderRadius: 2, bgcolor: '#4f46e5' }}
          >
            EDIT
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            disabled={deleteMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            {deleteMutation.isPending ? 'DELETING...' : 'DELETE'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Personal Information */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#fff',
              height: '100%',
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
              <PersonIcon sx={{ color: '#4f46e5', mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TodayIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }} />
                    <Typography variant="caption" color="text.secondary">
                      Age
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {plan.age || 'Not specified'} years
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <PersonIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }} />
                    <Typography variant="caption" color="text.secondary">
                      Gender
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {genderText}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <HeightIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }} />
                    <Typography variant="caption" color="text.secondary">
                      Height
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {plan.height ? `${plan.height} cm` : 'Not specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <ScaleIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }} />
                    <Typography variant="caption" color="text.secondary">
                      Weight
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {plan.weight ? `${plan.weight} kg` : 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <SpeedIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }} />
                <Typography variant="caption" color="text.secondary">
                  Activity Level
                </Typography>
              </Box>
              <Chip
                label={activityLevelText}
                sx={{
                  bgcolor: getActivityLevelColor,
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: '0.8rem',
                  height: 28,
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <FitnessCenterIcon
                  fontSize="small"
                  sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }}
                />
                <Typography variant="caption" color="text.secondary">
                  Goal
                </Typography>
              </Box>
              <Chip
                label={goalText}
                sx={{
                  bgcolor: getGoalColor,
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: '0.8rem',
                  height: 28,
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <LocalDiningIcon
                  fontSize="small"
                  sx={{ fontSize: 16, mr: 0.5, color: '#6c757d' }}
                />
                <Typography variant="caption" color="text.secondary">
                  Cooking Complexity
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="medium">
                {complexityText}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="medium" sx={{ mb: 1.5 }}>
              Meal Frequency
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Meals Per Day
                  </Typography>
                  <Typography variant="h6" color="#4f46e5" fontWeight="bold">
                    {plan.mealsPerDay || 3}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Snacks
                  </Typography>
                  <Typography variant="h6" color="#4f46e5" fontWeight="bold">
                    {plan.includeSnacks || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Nutrition Targets */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#fff',
              height: '100%',
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
                Nutrition Targets
              </Typography>
            </Box>

            {/* Daily Caloric Target */}
            <Box
              sx={{
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Daily Caloric Target
              </Typography>
              <Typography
                variant="h3"
                color="#4f46e5"
                sx={{
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                }}
              >
                {plan.targetDailyCalories || 0}
                <Typography component="span" variant="subtitle1" color="#6c757d" sx={{ ml: 0.5 }}>
                  kcal
                </Typography>
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1.5 }}>
              Macronutrient Distribution
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'rgba(79, 70, 229, 0.1)',
                    border: '1px solid rgba(79, 70, 229, 0.2)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Protein
                  </Typography>
                  <Typography variant="h6" color="#4f46e5" fontWeight="bold" sx={{ my: 0.5 }}>
                    {plan.proteinPercentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="#6c757d">
                    {macroGrams.protein}g
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Carbohydrates
                  </Typography>
                  <Typography variant="h6" color="#059669" fontWeight="bold" sx={{ my: 0.5 }}>
                    {plan.carbsPercentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="#6c757d">
                    {macroGrams.carbs}g
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'rgba(251, 146, 60, 0.1)',
                    border: '1px solid rgba(251, 146, 60, 0.2)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Fat
                  </Typography>
                  <Typography variant="h6" color="#ea580c" fontWeight="bold" sx={{ my: 0.5 }}>
                    {plan.fatPercentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="#6c757d">
                    {macroGrams.fat}g
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1.5 }}>
              Nutrient Targets
            </Typography>
            <Grid container spacing={2}>
              {plan.nutrientTargets &&
                Object.entries(plan.nutrientTargets).map(([nutrientName, value]) => (
                  <Grid item xs={6} md={4} key={nutrientName}>
                    <Box
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        {nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1)}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {value}
                        {nutrientName === 'sodium' ? ' mg' : ' g'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Dietary Restrictions & Preferences */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
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
              <NoFoodIcon sx={{ color: '#4f46e5', mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Dietary Restrictions & Preferences
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Ingredients to Avoid
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 80,
                  }}
                >
                  {!plan.dietaryRestrictions || plan.dietaryRestrictions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No specific ingredients to avoid.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.dietaryRestrictions.map((ingredient, index) => (
                        <Chip
                          key={index}
                          label={ingredient}
                          size="small"
                          sx={{
                            m: 0.5,
                            bgcolor: '#fff',
                            border: '1px solid #e53e3e',
                            color: '#e53e3e',
                            fontWeight: 'medium',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Additional Preferences
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 80,
                  }}
                >
                  {!plan.additionalPreferences || plan.additionalPreferences.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No additional preferences specified.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.additionalPreferences.map((preference, index) => (
                        <Chip
                          key={index}
                          label={preference}
                          size="small"
                          sx={{
                            m: 0.5,
                            bgcolor: '#fff',
                            border: '1px solid #4f46e5',
                            color: '#4f46e5',
                            fontWeight: 'medium',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Medical Conditions
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 80,
                  }}
                >
                  {!plan.medicalConditions || plan.medicalConditions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No medical conditions specified.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.medicalConditions.map((condition, index) => (
                        <Chip
                          key={index}
                          label={condition}
                          size="small"
                          sx={{
                            m: 0.5,
                            bgcolor: '#fff',
                            border: '1px solid #ed8936',
                            color: '#ed8936',
                            fontWeight: 'medium',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Diet Types
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 80,
                  }}
                >
                  {!plan.dietType || plan.dietType.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No specific diet types.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.dietType.map((diet, index) => (
                        <Chip
                          key={index}
                          label={diet}
                          size="small"
                          sx={{
                            m: 0.5,
                            bgcolor: '#fff',
                            border: '1px solid #38a169',
                            color: '#38a169',
                            fontWeight: 'medium',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Vitamins & Minerals Focus
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}
                >
                  {!plan.vitaminsAndMinerals || plan.vitaminsAndMinerals.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No specific vitamins or minerals prioritized.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.vitaminsAndMinerals.map((vitamin, index) => (
                        <Chip
                          key={index}
                          label={vitamin}
                          size="small"
                          icon={<SpaIcon style={{ fontSize: '0.875rem' }} />}
                          sx={{
                            m: 0.5,
                            bgcolor: '#fff',
                            border: '1px solid #3182ce',
                            color: '#3182ce',
                            fontWeight: 'medium',
                            borderRadius: 1,
                            '& .MuiChip-iconSmall': {
                              color: '#3182ce',
                              ml: 0.5,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition plan? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
