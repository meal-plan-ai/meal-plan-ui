'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
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
  Switch,
  Button,
  Divider,
  Chip,
  IconButton,
  SelectChangeEvent,
  InputAdornment,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { getCharacteristicById, updateCharacteristic } from '../../actions';
import { FormState, EMPTY_FORM_STATE } from '@/utils/form-state';
import { useFormReset } from '@/hooks/useFormReset';

// Define a type for the nutrition characteristics
type CharacteristicsType = {
  id?: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
  caloriesTarget: number;
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsPerDay: number;
  includingSnacks: boolean;
  nutrientTargets: {
    fiber: number;
    sugar: number;
    sodium: number;
  };
  vitaminsAndMinerals: Array<{ name: string; priority: string }>;
  avoidIngredients: string[];
  preferences: {
    organic: boolean;
    seasonal: boolean;
    localProduce: boolean;
    sustainableSeafood: boolean;
    budgetFriendly: boolean;
  };
};

// Initial form state for validation
const initialState: FormState = EMPTY_FORM_STATE;

export default function EditCharacteristicsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [newVitamin, setNewVitamin] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Setup form state with server validation action
  const [formState, action, isPending] = useFormState(
    (prevState: FormState, formData: FormData) => {
      // Add the ID to the form data before passing to the action
      return updateCharacteristic(prevState, formData, id);
    },
    initialState
  );

  const formRef = useFormReset(formState);

  // Check if submission was successful
  if (formState.status === 'SUCCESS' && !redirecting) {
    setRedirecting(true);
    // Redirect after a successful submission
    setTimeout(() => {
      router.push('/cabinet/characteristics');
    }, 1500);
  }

  const [characteristics, setCharacteristics] = useState<CharacteristicsType>({
    name: 'Loading...',
    weight: 70,
    height: 175,
    age: 30,
    activityLevel: 'moderate',
    goal: 'maintain',
    caloriesTarget: 2000,
    macroDistribution: {
      protein: 30,
      carbs: 40,
      fat: 30,
    },
    mealsPerDay: 3,
    includingSnacks: true,
    nutrientTargets: {
      fiber: 25,
      sugar: 25,
      sodium: 2300,
    },
    vitaminsAndMinerals: [],
    avoidIngredients: [],
    preferences: {
      organic: false,
      seasonal: true,
      localProduce: false,
      sustainableSeafood: true,
      budgetFriendly: true,
    },
  });

  // Fetch the current characteristics
  useEffect(() => {
    const fetchCharacteristic = async () => {
      try {
        const result = await getCharacteristicById(id);
        if (result) {
          setCharacteristics(result);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching characteristic:', error);
        setLoading(false);
      }
    };

    fetchCharacteristic();
  }, [id]);

  // Handle text and number inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacteristics(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CharacteristicsType] as object),
          [child]: value,
        },
      }));
    } else {
      setCharacteristics(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle slider changes
  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setCharacteristics(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof CharacteristicsType] as object),
            [child]: newValue,
          },
        }));
      } else {
        setCharacteristics(prev => ({ ...prev, [name]: newValue }));
      }
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCharacteristics(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacteristics(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CharacteristicsType] as object),
          [child]: checked,
        },
      }));
    } else {
      setCharacteristics(prev => ({ ...prev, [name]: checked }));
    }
  };

  // Handle vitamin/mineral priority change
  const handlePriorityChange = (index: number, priority: string) => {
    const updatedVitamins = [...characteristics.vitaminsAndMinerals];
    updatedVitamins[index].priority = priority;
    setCharacteristics(prev => ({ ...prev, vitaminsAndMinerals: updatedVitamins }));
  };

  // Add a new vitamin/mineral
  const handleAddVitamin = () => {
    if (newVitamin.trim()) {
      setCharacteristics(prev => ({
        ...prev,
        vitaminsAndMinerals: [
          ...prev.vitaminsAndMinerals,
          { name: newVitamin, priority: 'medium' },
        ],
      }));
      setNewVitamin('');
    }
  };

  // Remove a vitamin/mineral
  const handleRemoveVitamin = (index: number) => {
    const updatedVitamins = [...characteristics.vitaminsAndMinerals];
    updatedVitamins.splice(index, 1);
    setCharacteristics(prev => ({ ...prev, vitaminsAndMinerals: updatedVitamins }));
  };

  // Add a new ingredient to avoid
  const handleAddIngredient = () => {
    if (newIngredient.trim() && !characteristics.avoidIngredients.includes(newIngredient)) {
      setCharacteristics(prev => ({
        ...prev,
        avoidIngredients: [...prev.avoidIngredients, newIngredient],
      }));
      setNewIngredient('');
    }
  };

  // Remove an ingredient
  const handleRemoveIngredient = (ingredient: string) => {
    setCharacteristics(prev => ({
      ...prev,
      avoidIngredients: prev.avoidIngredients.filter(item => item !== ingredient),
    }));
  };

  // Calculate BMR and suggested calories
  const calculateCalories = () => {
    // Mifflin-St Jeor Equation
    const { weight, height, age, activityLevel, goal } = characteristics;

    // BMR calculation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    // Activity multiplier
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryActive':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.55;
    }

    let caloriesTarget = Math.round(bmr * activityMultiplier);

    // Goal adjustment
    switch (goal) {
      case 'lose':
        caloriesTarget = Math.round(caloriesTarget * 0.8);
        break; // 20% deficit
      case 'gain':
        caloriesTarget = Math.round(caloriesTarget * 1.15);
        break; // 15% surplus
    }

    setCharacteristics(prev => ({ ...prev, caloriesTarget }));
  };

  const handleCancel = () => {
    router.push('/cabinet/characteristics');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Nutrition Plan
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
        >
          Back to List
        </Button>
      </Box>

      {formState.status === 'SUCCESS' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Nutrition plan updated successfully! Redirecting...
        </Alert>
      )}

      {formState.status === 'ERROR' && formState.message && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formState.message}
        </Alert>
      )}

      <form action={action} ref={formRef}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Plan Name"
                name="name"
                value={characteristics.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                error={Boolean(formState.fieldErrors?.name)}
                helperText={formState.fieldErrors?.name?.[0]}
              />
            </Grid>

            {/* Add hidden fields for complex arrays */}
            <input type="hidden" name="id" value={id} />
            <input
              type="hidden"
              name="vitaminsAndMinerals"
              value={JSON.stringify(characteristics.vitaminsAndMinerals)}
            />
            <input
              type="hidden"
              name="avoidIngredients"
              value={JSON.stringify(characteristics.avoidIngredients)}
            />

            <Grid item xs={12} sm={4}>
              <TextField
                label="Weight"
                type="number"
                name="weight"
                value={characteristics.weight}
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
                value={characteristics.height}
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
                value={characteristics.age}
                onChange={handleInputChange}
                fullWidth
                error={Boolean(formState.fieldErrors?.age)}
                helperText={formState.fieldErrors?.age?.[0]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(formState.fieldErrors?.activityLevel)}>
                <InputLabel>Activity Level</InputLabel>
                <Select
                  name="activityLevel"
                  value={characteristics.activityLevel}
                  onChange={handleSelectChange}
                  label="Activity Level"
                >
                  <MenuItem value="sedentary">Sedentary (little to no exercise)</MenuItem>
                  <MenuItem value="light">Light (light exercise 1-3 days/week)</MenuItem>
                  <MenuItem value="moderate">Moderate (moderate exercise 3-5 days/week)</MenuItem>
                  <MenuItem value="active">Active (hard exercise 6-7 days/week)</MenuItem>
                  <MenuItem value="veryActive">
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
              <FormControl fullWidth error={Boolean(formState.fieldErrors?.goal)}>
                <InputLabel>Goal</InputLabel>
                <Select
                  name="goal"
                  value={characteristics.goal}
                  onChange={handleSelectChange}
                  label="Goal"
                >
                  <MenuItem value="lose">Weight Loss</MenuItem>
                  <MenuItem value="maintain">Maintenance</MenuItem>
                  <MenuItem value="gain">Weight Gain</MenuItem>
                </Select>
                {formState.fieldErrors?.goal && (
                  <Typography color="error" variant="caption">
                    {formState.fieldErrors.goal[0]}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={calculateCalories}
                  startIcon={<RefreshIcon />}
                >
                  Calculate Suggested Calories
                </Button>
              </Box>

              <Typography gutterBottom>
                Target Daily Calories: {characteristics.caloriesTarget} kcal
              </Typography>
              <Slider
                value={characteristics.caloriesTarget}
                onChange={handleSliderChange('caloriesTarget')}
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
              {formState.fieldErrors?.caloriesTarget && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors.caloriesTarget[0]}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Protein: {characteristics.macroDistribution.protein}%
                <Tooltip
                  title={`Approximately ${Math.round((characteristics.caloriesTarget * characteristics.macroDistribution.protein) / 400)}g of protein per day`}
                >
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Slider
                name="macroDistribution.protein"
                value={characteristics.macroDistribution.protein}
                onChange={handleSliderChange('macroDistribution.protein')}
                min={10}
                max={60}
                step={5}
                valueLabelDisplay="auto"
              />
              {formState.fieldErrors?.['macroDistribution.protein'] && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors['macroDistribution.protein'][0]}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Carbs: {characteristics.macroDistribution.carbs}%
                <Tooltip
                  title={`Approximately ${Math.round((characteristics.caloriesTarget * characteristics.macroDistribution.carbs) / 400)}g of carbs per day`}
                >
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Slider
                name="macroDistribution.carbs"
                value={characteristics.macroDistribution.carbs}
                onChange={handleSliderChange('macroDistribution.carbs')}
                min={10}
                max={70}
                step={5}
                valueLabelDisplay="auto"
              />
              {formState.fieldErrors?.['macroDistribution.carbs'] && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors['macroDistribution.carbs'][0]}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Fat: {characteristics.macroDistribution.fat}%
                <Tooltip
                  title={`Approximately ${Math.round((characteristics.caloriesTarget * characteristics.macroDistribution.fat) / 900)}g of fat per day`}
                >
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Slider
                name="macroDistribution.fat"
                value={characteristics.macroDistribution.fat}
                onChange={handleSliderChange('macroDistribution.fat')}
                min={10}
                max={60}
                step={5}
                valueLabelDisplay="auto"
              />
              {formState.fieldErrors?.['macroDistribution.fat'] && (
                <Typography color="error" variant="caption">
                  {formState.fieldErrors['macroDistribution.fat'][0]}
                </Typography>
              )}
            </Grid>

            {/* Display macro distribution validation error */}
            {formState.fieldErrors?.macroSum && (
              <Grid item xs={12}>
                <Alert severity="error">{formState.fieldErrors.macroSum[0]}</Alert>
              </Grid>
            )}

            {Math.abs(
              characteristics.macroDistribution.protein +
                characteristics.macroDistribution.carbs +
                characteristics.macroDistribution.fat -
                100
            ) > 0.1 && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Macronutrient percentages should sum to 100%. Current total:{' '}
                  {characteristics.macroDistribution.protein +
                    characteristics.macroDistribution.carbs +
                    characteristics.macroDistribution.fat}
                  %
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                label="Meals Per Day"
                type="number"
                name="mealsPerDay"
                value={characteristics.mealsPerDay}
                onChange={handleInputChange}
                fullWidth
                error={Boolean(formState.fieldErrors?.mealsPerDay)}
                helperText={formState.fieldErrors?.mealsPerDay?.[0]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={characteristics.includingSnacks}
                    onChange={handleSwitchChange}
                    name="includingSnacks"
                  />
                }
                label="Include Snacks"
              />
              <input
                type="hidden"
                name="includingSnacks"
                value={characteristics.includingSnacks.toString()}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Nutrient Targets</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Fiber"
                    type="number"
                    name="nutrientTargets.fiber"
                    value={characteristics.nutrientTargets.fiber}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    error={Boolean(formState.fieldErrors?.['nutrientTargets.fiber'])}
                    helperText={formState.fieldErrors?.['nutrientTargets.fiber']?.[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sugar"
                    type="number"
                    name="nutrientTargets.sugar"
                    value={characteristics.nutrientTargets.sugar}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    error={Boolean(formState.fieldErrors?.['nutrientTargets.sugar'])}
                    helperText={formState.fieldErrors?.['nutrientTargets.sugar']?.[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sodium"
                    type="number"
                    name="nutrientTargets.sodium"
                    value={characteristics.nutrientTargets.sodium}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mg</InputAdornment>,
                    }}
                    error={Boolean(formState.fieldErrors?.['nutrientTargets.sodium'])}
                    helperText={formState.fieldErrors?.['nutrientTargets.sodium']?.[0]}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Vitamins & Minerals</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Select vitamins and minerals you want to prioritize in your meal plan:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {characteristics.vitaminsAndMinerals.map((vitamin, index) => (
                    <Chip
                      key={index}
                      label={vitamin.name}
                      color={
                        vitamin.priority === 'high'
                          ? 'primary'
                          : vitamin.priority === 'medium'
                            ? 'secondary'
                            : 'default'
                      }
                      onDelete={() => handleRemoveVitamin(index)}
                      onClick={() => {
                        const priorities = ['low', 'medium', 'high'];
                        const currentIndex = priorities.indexOf(vitamin.priority);
                        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                        handlePriorityChange(index, nextPriority);
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TextField
                  label="Add Vitamin or Mineral"
                  value={newVitamin}
                  onChange={e => setNewVitamin(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddVitamin()}
                  size="small"
                  fullWidth
                />
                <IconButton color="primary" onClick={handleAddVitamin} sx={{ ml: 1 }}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.8rem' }}>
                Tip: Click on a chip to cycle through priority levels (low, medium, high)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Dietary Restrictions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Add ingredients you want to avoid in your meal plan:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 1 }}>
                {characteristics.avoidIngredients.map((ingredient, index) => (
                  <Chip
                    key={index}
                    label={ingredient}
                    onDelete={() => handleRemoveIngredient(ingredient)}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Add Ingredient to Avoid"
                  value={newIngredient}
                  onChange={e => setNewIngredient(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddIngredient()}
                  size="small"
                  fullWidth
                />
                <IconButton color="primary" onClick={handleAddIngredient} sx={{ ml: 1 }}>
                  <AddIcon />
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Additional Preferences</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={characteristics.preferences.organic}
                        onChange={handleSwitchChange}
                        name="preferences.organic"
                      />
                    }
                    label="Prefer Organic Ingredients"
                  />
                  <input
                    type="hidden"
                    name="preferences.organic"
                    value={characteristics.preferences.organic.toString()}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={characteristics.preferences.seasonal}
                        onChange={handleSwitchChange}
                        name="preferences.seasonal"
                      />
                    }
                    label="Prefer Seasonal Ingredients"
                  />
                  <input
                    type="hidden"
                    name="preferences.seasonal"
                    value={characteristics.preferences.seasonal.toString()}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={characteristics.preferences.localProduce}
                        onChange={handleSwitchChange}
                        name="preferences.localProduce"
                      />
                    }
                    label="Prefer Local Produce"
                  />
                  <input
                    type="hidden"
                    name="preferences.localProduce"
                    value={characteristics.preferences.localProduce.toString()}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={characteristics.preferences.sustainableSeafood}
                        onChange={handleSwitchChange}
                        name="preferences.sustainableSeafood"
                      />
                    }
                    label="Prefer Sustainable Seafood"
                  />
                  <input
                    type="hidden"
                    name="preferences.sustainableSeafood"
                    value={characteristics.preferences.sustainableSeafood.toString()}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={characteristics.preferences.budgetFriendly}
                        onChange={handleSwitchChange}
                        name="preferences.budgetFriendly"
                      />
                    }
                    label="Prefer Budget-Friendly Options"
                  />
                  <input
                    type="hidden"
                    name="preferences.budgetFriendly"
                    value={characteristics.preferences.budgetFriendly.toString()}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button variant="outlined" color="inherit" onClick={handleCancel} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled={isPending || redirecting}
          >
            {isPending ? 'Saving...' : 'Save Plan'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
