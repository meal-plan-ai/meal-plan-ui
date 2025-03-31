'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Button,
  Divider,
  IconButton,
  SelectChangeEvent,
  InputAdornment,
  Tooltip,
  Alert,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { FormState } from '@/utils/form-state';
import { calculateCalories } from '@/utils/calorieCalculations';
import {
  ActivityLevel,
  Gender,
  Goal,
  CookingComplexity,
  MealCharacteristicDto,
} from '@/api/query/meal-characteristics/meal-characteristics.dto';
import ChipInputSection from '@/components/molecules/ChipInputSection';

// List of additional preferences
const preferences = [
  'Organic',
  'Local Produce',
  'Budget Friendly',
  'Seasonal',
  'Sustainable Seafood',
];

// Default empty characteristics state
const defaultCharacteristics: MealCharacteristicDto = {
  // Basic information
  planName: 'My New Nutrition Plan',
  gender: Gender.MALE,
  age: 30,
  height: 175,
  weight: 70,
  activityLevel: ActivityLevel.MODERATE,
  goal: Goal.MAINTENANCE,

  // Caloric and macronutrient targets
  targetDailyCalories: 2000,
  proteinPercentage: 30,
  carbsPercentage: 40,
  fatPercentage: 30,

  // Meal frequency
  mealsPerDay: 3,
  includeSnacks: 1,

  // Diet preferences & restrictions
  medicalConditions: ['Diabetes', 'High Blood Pressure'],
  dietType: ['Vegan', 'Vegetarian'],
  dietaryRestrictions: ['Shellfish', 'Peanuts'],

  // Nutrients
  nutrientTargets: {
    fiber: 25,
    sugar: 25,
    sodium: 2300,
  },

  // Vitamins and minerals
  vitaminsAndMinerals: ['Vitamin D', 'Iron', 'Calcium'],

  // Additional preferences
  additionalPreferences: ['Organic', 'Seasonal', 'Sustainable Seafood', 'Budget Friendly'],

  cookingComplexity: CookingComplexity.STANDARD,
};

interface MealCharacteristicsFormProps {
  isEditMode: boolean;
  initialData?: MealCharacteristicDto;
  formState: FormState;
  isPending: boolean;
  action: (formData: FormData) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  onCancel: () => void;
  submitButtonText?: string;
}

export default function MealCharacteristicsForm({
  isEditMode,
  initialData,
  formState,
  isPending,
  action,
  formRef,
  onCancel,
  submitButtonText = isEditMode ? 'Update Plan' : 'Save Plan',
}: MealCharacteristicsFormProps) {
  // Use initial data if provided (for edit mode), otherwise use defaults
  const [characteristics, setCharacteristics] = useState<MealCharacteristicDto>(
    initialData || defaultCharacteristics
  );

  // For chips input fields
  const [newVitamin, setNewVitamin] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newMedicalCondition, setNewMedicalCondition] = useState('');
  const [newDietType, setNewDietType] = useState('');
  const [newNutrientName, setNewNutrientName] = useState('');
  const [newNutrientValue, setNewNutrientValue] = useState<number | ''>('');

  // Update form when initial data changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      setCharacteristics(initialData);
    }
  }, [initialData]);

  // Memoize calculation parameters for calorie calculation
  const calculationParams = useMemo(
    () => ({
      weight: characteristics.weight,
      height: characteristics.height,
      age: characteristics.age,
      activityLevel: characteristics.activityLevel,
      goal: characteristics.goal,
    }),
    [
      characteristics.weight,
      characteristics.height,
      characteristics.age,
      characteristics.activityLevel,
      characteristics.goal,
    ]
  );

  // Handle text and number inputs
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested properties for nutrientTargets
    if (name.startsWith('nutrientTargets.')) {
      const nutrientName = name.split('.')[1];
      setCharacteristics(prev => ({
        ...prev,
        nutrientTargets: {
          ...(prev.nutrientTargets || {}),
          [nutrientName]: Number(value),
        },
      }));
    } else {
      setCharacteristics(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  // Handle slider changes
  const handleSliderChange = useCallback(
    (name: string) => (event: Event, newValue: number | number[]) => {
      setCharacteristics(prev => ({ ...prev, [name]: Number(newValue) }));
    },
    []
  );

  // Handle select changes
  const handleSelectChange = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCharacteristics(prev => ({ ...prev, [name]: value }));
  }, []);

  // Add a new vitamin/mineral
  const handleAddVitamin = useCallback(() => {
    if (newVitamin.trim()) {
      setCharacteristics(prev => ({
        ...prev,
        vitaminsAndMinerals: [...(prev.vitaminsAndMinerals || []), newVitamin],
      }));
      setNewVitamin('');
    }
  }, [newVitamin]);

  // Remove a vitamin/mineral
  const handleRemoveVitamin = useCallback((index: number) => {
    setCharacteristics(prev => ({
      ...prev,
      vitaminsAndMinerals: (prev.vitaminsAndMinerals || []).filter((_, i) => i !== index),
    }));
  }, []);

  // Add a new ingredient to avoid
  const handleAddIngredient = useCallback(() => {
    if (newIngredient.trim() && !characteristics.dietaryRestrictions?.includes(newIngredient)) {
      setCharacteristics(prev => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), newIngredient],
      }));
      setNewIngredient('');
    }
  }, [newIngredient, characteristics.dietaryRestrictions]);

  // Remove an ingredient
  const handleRemoveIngredient = useCallback((ingredient: string) => {
    setCharacteristics(prev => ({
      ...prev,
      dietaryRestrictions: (prev.dietaryRestrictions || []).filter(item => item !== ingredient),
    }));
  }, []);

  // Add a new medical condition
  const handleAddMedicalCondition = useCallback(() => {
    if (
      newMedicalCondition.trim() &&
      !characteristics.medicalConditions?.includes(newMedicalCondition)
    ) {
      setCharacteristics(prev => ({
        ...prev,
        medicalConditions: [...(prev.medicalConditions || []), newMedicalCondition],
      }));
      setNewMedicalCondition('');
    }
  }, [newMedicalCondition, characteristics.medicalConditions]);

  // Remove a medical condition
  const handleRemoveMedicalCondition = useCallback((condition: string) => {
    setCharacteristics(prev => ({
      ...prev,
      medicalConditions: (prev.medicalConditions || []).filter(item => item !== condition),
    }));
  }, []);

  // Add a new diet type
  const handleAddDietType = useCallback(() => {
    if (newDietType.trim() && !characteristics.dietType?.includes(newDietType)) {
      setCharacteristics(prev => ({
        ...prev,
        dietType: [...(prev.dietType || []), newDietType],
      }));
      setNewDietType('');
    }
  }, [newDietType, characteristics.dietType]);

  // Remove a diet type
  const handleRemoveDietType = useCallback((dietType: string) => {
    setCharacteristics(prev => ({
      ...prev,
      dietType: (prev.dietType || []).filter(item => item !== dietType),
    }));
  }, []);

  // Calculate calories using the utility function
  const handleCalculateCalories = useCallback(() => {
    const targetCalories = calculateCalories(calculationParams);
    if (targetCalories) {
      setCharacteristics(prev => ({ ...prev, targetDailyCalories: targetCalories }));
    }
  }, [calculationParams]);

  // Add a new custom nutrient target
  const handleAddNutrientTarget = useCallback(() => {
    if (newNutrientName.trim() && newNutrientValue !== '') {
      setCharacteristics(prev => ({
        ...prev,
        nutrientTargets: {
          ...(prev.nutrientTargets || {}),
          [newNutrientName.trim()]: Number(newNutrientValue),
        },
      }));
      setNewNutrientName('');
      setNewNutrientValue('');
    }
  }, [newNutrientName, newNutrientValue]);

  // Remove a nutrient target
  const handleRemoveNutrientTarget = useCallback((nutrientName: string) => {
    setCharacteristics(prev => {
      const updatedTargets = { ...(prev.nutrientTargets || {}) };
      delete updatedTargets[nutrientName];
      return {
        ...prev,
        nutrientTargets: updatedTargets,
      };
    });
  }, []);

  // Handle preference checkbox changes
  const handlePreferenceChange = useCallback((preference: string, isChecked: boolean) => {
    setCharacteristics(prev => {
      const currentPreferences = [...(prev.additionalPreferences || [])];
      if (isChecked && !currentPreferences.includes(preference)) {
        return {
          ...prev,
          additionalPreferences: [...currentPreferences, preference],
        };
      } else if (!isChecked && currentPreferences.includes(preference)) {
        return {
          ...prev,
          additionalPreferences: currentPreferences.filter(p => p !== preference),
        };
      }
      return prev;
    });
  }, []);

  // Memoize macro nutrient gram calculations for the UI tooltips
  const macroGrams = useMemo(() => {
    const { targetDailyCalories, proteinPercentage, carbsPercentage, fatPercentage } =
      characteristics;
    return {
      protein: Math.round(((targetDailyCalories || 0) * (proteinPercentage || 0)) / 400),
      carbs: Math.round(((targetDailyCalories || 0) * (carbsPercentage || 0)) / 400),
      fat: Math.round(((targetDailyCalories || 0) * (fatPercentage || 0)) / 900),
    };
  }, [characteristics]);

  // Memoize validation for macros sum
  const macroValidation = useMemo(() => {
    const { proteinPercentage, carbsPercentage, fatPercentage } = characteristics;
    const total = (proteinPercentage || 0) + (carbsPercentage || 0) + (fatPercentage || 0);
    return {
      total,
      isValid: Math.abs(total - 100) <= 0.1,
    };
  }, [characteristics]);

  return (
    <form action={action} ref={formRef}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Plan Name"
              name="planName"
              value={characteristics.planName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              error={Boolean(formState.fieldErrors?.planName)}
              helperText={formState.fieldErrors?.planName?.[0]}
            />
          </Grid>

          {/* Add hidden fields for complex arrays */}
          <input
            type="hidden"
            name="vitaminsAndMinerals"
            value={JSON.stringify(characteristics.vitaminsAndMinerals || [])}
          />
          <input
            type="hidden"
            name="dietaryRestrictions"
            value={JSON.stringify(characteristics.dietaryRestrictions || [])}
          />
          <input
            type="hidden"
            name="additionalPreferences"
            value={JSON.stringify(characteristics.additionalPreferences || [])}
          />
          <input
            type="hidden"
            name="medicalConditions"
            value={JSON.stringify(characteristics.medicalConditions || [])}
          />
          <input
            type="hidden"
            name="dietType"
            value={JSON.stringify(characteristics.dietType || [])}
          />
          <input
            type="hidden"
            name="nutrientTargets"
            value={JSON.stringify(characteristics.nutrientTargets || {})}
          />

          {/* Add hidden input for targetDailyCalories to ensure it's included in form submission */}
          <input
            type="hidden"
            name="targetDailyCalories"
            value={characteristics.targetDailyCalories}
          />

          <Grid item xs={12} sm={4}>
            <TextField
              label="Weight"
              type="number"
              name="weight"
              value={characteristics.weight || ''}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              error={Boolean(formState.fieldErrors?.weight)}
              helperText={formState.fieldErrors?.weight?.[0]}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Height"
              type="number"
              name="height"
              value={characteristics.height || ''}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
              error={Boolean(formState.fieldErrors?.height)}
              helperText={formState.fieldErrors?.height?.[0]}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Age"
              type="number"
              name="age"
              value={characteristics.age || ''}
              onChange={handleInputChange}
              fullWidth
              error={Boolean(formState.fieldErrors?.age)}
              helperText={formState.fieldErrors?.age?.[0]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formState.fieldErrors?.gender)}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={characteristics.gender || ''}
                onChange={handleSelectChange}
                label="Gender"
              >
                <MenuItem value={Gender.MALE}>Male</MenuItem>
                <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                <MenuItem value={Gender.OTHER}>Other</MenuItem>
              </Select>
              {formState.fieldErrors?.gender && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors.gender[0]}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formState.fieldErrors?.goal)}>
              <InputLabel>Goal</InputLabel>
              <Select
                name="goal"
                value={characteristics.goal || ''}
                onChange={handleSelectChange}
                label="Goal"
              >
                <MenuItem value={Goal.WEIGHT_LOSS}>Weight Loss</MenuItem>
                <MenuItem value={Goal.MAINTENANCE}>Maintenance</MenuItem>
                <MenuItem value={Goal.MUSCLE_GAIN}>Muscle Gain</MenuItem>
              </Select>
              {formState.fieldErrors?.goal && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors.goal[0]}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formState.fieldErrors?.activityLevel)}>
              <InputLabel>Activity Level</InputLabel>
              <Select
                name="activityLevel"
                value={characteristics.activityLevel || ''}
                onChange={handleSelectChange}
                label="Activity Level"
              >
                <MenuItem value={ActivityLevel.SEDENTARY}>
                  Sedentary (little to no exercise)
                </MenuItem>
                <MenuItem value={ActivityLevel.LIGHT}>
                  Light (light exercise 1-3 days/week)
                </MenuItem>
                <MenuItem value={ActivityLevel.MODERATE}>
                  Moderate (moderate exercise 3-5 days/week)
                </MenuItem>
                <MenuItem value={ActivityLevel.ACTIVE}>
                  Active (hard exercise 6-7 days/week)
                </MenuItem>
                <MenuItem value={ActivityLevel.VERY_ACTIVE}>
                  Very Active (very hard exercise & physical job)
                </MenuItem>
              </Select>
              {formState.fieldErrors?.activityLevel && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors.activityLevel[0]}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCalculateCalories}
                startIcon={<RefreshIcon />}
              >
                Calculate Suggested Calories
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Target Daily Calories: {characteristics.targetDailyCalories || 0} kcal
            </Typography>
            <Slider
              value={characteristics.targetDailyCalories}
              onChange={handleSliderChange('targetDailyCalories')}
              min={1200}
              max={4000}
              step={50}
              valueLabelDisplay="auto"
              marks={[
                { value: 1500, label: '1500' },
                { value: 2000, label: '2000' },
                { value: 2500, label: '2500' },
                { value: 3000, label: '3000' },
                { value: 3500, label: '3500' },
              ]}
            />
            {formState.fieldErrors?.targetDailyCalories && (
              <Typography color="error" variant="caption">
                {formState.fieldErrors.targetDailyCalories[0]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>
              Protein: {characteristics.proteinPercentage || 0}%
              <Tooltip title={`Approximately ${macroGrams.protein}g of protein per day`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Slider
              name="proteinPercentage"
              value={characteristics.proteinPercentage || 0}
              onChange={handleSliderChange('proteinPercentage')}
              min={10}
              max={60}
              step={5}
              valueLabelDisplay="auto"
            />
            {formState.fieldErrors?.proteinPercentage && (
              <Typography color="error" variant="caption">
                {formState.fieldErrors.proteinPercentage[0]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>
              Carbs: {characteristics.carbsPercentage || 0}%
              <Tooltip title={`Approximately ${macroGrams.carbs}g of carbs per day`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Slider
              name="carbsPercentage"
              value={characteristics.carbsPercentage || 0}
              onChange={handleSliderChange('carbsPercentage')}
              min={10}
              max={70}
              step={5}
              valueLabelDisplay="auto"
            />
            {formState.fieldErrors?.carbsPercentage && (
              <Typography color="error" variant="caption">
                {formState.fieldErrors.carbsPercentage[0]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>
              Fat: {characteristics.fatPercentage || 0}%
              <Tooltip title={`Approximately ${macroGrams.fat}g of fat per day`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Slider
              name="fatPercentage"
              value={characteristics.fatPercentage || 0}
              onChange={handleSliderChange('fatPercentage')}
              min={10}
              max={60}
              step={5}
              valueLabelDisplay="auto"
            />
            {formState.fieldErrors?.fatPercentage && (
              <Typography color="error" variant="caption">
                {formState.fieldErrors.fatPercentage[0]}
              </Typography>
            )}
          </Grid>

          {/* Display macro distribution validation error */}
          {formState.fieldErrors?.macroSum && (
            <Grid item xs={12}>
              <Alert severity="error">{formState.fieldErrors.macroSum[0]}</Alert>
            </Grid>
          )}

          {!macroValidation.isValid && (
            <Grid item xs={12}>
              <Alert severity="warning">
                Macronutrient percentages should sum to 100%. Current total: {macroValidation.total}
                %
              </Alert>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formState.fieldErrors?.mealsPerDay)}>
              <InputLabel>Meals Per Day</InputLabel>
              <Select
                name="mealsPerDay"
                value={characteristics.mealsPerDay?.toString() || '3'}
                onChange={e => {
                  setCharacteristics(prev => ({
                    ...prev,
                    mealsPerDay: Number(e.target.value),
                  }));
                }}
                label="Meals Per Day"
              >
                <MenuItem value="1">1 Meal</MenuItem>
                <MenuItem value="2">2 Meals</MenuItem>
                <MenuItem value="3">3 Meals</MenuItem>
                <MenuItem value="4">4 Meals</MenuItem>
                <MenuItem value="5">5 Meals</MenuItem>
              </Select>
              {formState.fieldErrors?.mealsPerDay && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors.mealsPerDay[0]}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Snacks</InputLabel>
              <Select
                name="includeSnacks"
                value={characteristics.includeSnacks?.toString() || '1'}
                onChange={e => {
                  setCharacteristics(prev => ({
                    ...prev,
                    includeSnacks: Number(e.target.value),
                  }));
                }}
                label="Snacks"
              >
                <MenuItem value="1">1 Snack</MenuItem>
                <MenuItem value="2">2 Snacks</MenuItem>
                <MenuItem value="3">3 Snacks</MenuItem>
              </Select>
            </FormControl>
            <input
              type="hidden"
              name="includeSnacks"
              value={characteristics.includeSnacks?.toString() || '1'}
            />
          </Grid>

          <Grid item xs={6}>
            <ChipInputSection
              title="Medical Conditions"
              description="Add any medical conditions that may affect your nutrition plan:"
              items={characteristics.medicalConditions || []}
              onAdd={handleAddMedicalCondition}
              onRemove={handleRemoveMedicalCondition}
              inputValue={newMedicalCondition}
              onInputChange={e => setNewMedicalCondition(e.target.value)}
              inputLabel="Add Medical Condition"
            />
          </Grid>

          <Grid item xs={6}>
            <ChipInputSection
              title="Diet Type"
              description="Select diet types that apply to you:"
              items={characteristics.dietType || []}
              onAdd={handleAddDietType}
              onRemove={handleRemoveDietType}
              inputValue={newDietType}
              onInputChange={e => setNewDietType(e.target.value)}
              inputLabel="Add Diet Type"
            />
          </Grid>
          <Grid item xs={6}>
            <ChipInputSection
              title="Vitamins & Minerals"
              description="Select vitamins and minerals you want to prioritize in your meal plan:"
              items={characteristics.vitaminsAndMinerals || []}
              onAdd={handleAddVitamin}
              onRemove={vitamin => {
                const index = characteristics.vitaminsAndMinerals?.indexOf(vitamin) || -1;
                if (index !== -1) {
                  handleRemoveVitamin(index);
                }
              }}
              inputValue={newVitamin}
              onInputChange={e => setNewVitamin(e.target.value)}
              inputLabel="Add Vitamin or Mineral"
            />
          </Grid>
          <Grid item xs={6}>
            <ChipInputSection
              title="Dietary Restrictions"
              description="Add ingredients you want to avoid in your meal plan:"
              items={characteristics.dietaryRestrictions || []}
              onAdd={handleAddIngredient}
              onRemove={handleRemoveIngredient}
              inputValue={newIngredient}
              onInputChange={e => setNewIngredient(e.target.value)}
              inputLabel="Add Ingredient to Avoid"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nutrient Targets
            </Typography>
            {/* Display custom nutrient targets */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {characteristics.nutrientTargets &&
                Object.entries(characteristics.nutrientTargets).map(([nutrientName, value]) => (
                  <Grid item xs={12} sm={4} key={nutrientName}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label={nutrientName}
                        type="number"
                        value={value}
                        onChange={e => {
                          setCharacteristics(prev => ({
                            ...prev,
                            nutrientTargets: {
                              ...(prev.nutrientTargets || {}),
                              [nutrientName]: Number(e.target.value),
                            },
                          }));
                        }}
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveNutrientTarget(nutrientName)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
            </Grid>

            {/* Add new nutrient target fields */}
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Add Custom Nutrient Target
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <TextField
                label="Nutrient Name"
                value={newNutrientName}
                onChange={e => setNewNutrientName(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Target Value"
                type="number"
                value={newNutrientValue}
                onChange={e =>
                  setNewNutrientValue(e.target.value === '' ? '' : Number(e.target.value))
                }
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddNutrientTarget}
                disabled={!newNutrientName.trim() || newNutrientValue === ''}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Cooking Complexity
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Cooking Complexity</InputLabel>
              <Select
                name="cookingComplexity"
                value={characteristics.cookingComplexity || ''}
                onChange={handleSelectChange}
                label="Cooking Complexity"
              >
                <MenuItem value={CookingComplexity.QUICK}>Quick & Easy</MenuItem>
                <MenuItem value={CookingComplexity.STANDARD}>Standard</MenuItem>
                <MenuItem value={CookingComplexity.GOURMET}>Gourmet</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Additional Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select additional preferences for your meal plan:
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {preferences.map(preference => (
                <Grid item xs={12} sm={6} md={4} key={preference}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={(characteristics.additionalPreferences || []).includes(preference)}
                        onChange={e => handlePreferenceChange(preference, e.target.checked)}
                      />
                    }
                    label={preference}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : submitButtonText}
          </Button>
        </Box>
      </Paper>
    </form>
  );
}
