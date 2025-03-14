'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Remove as RemoveIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { getCharacteristicById } from '../../actions';
import { NutritionCharacteristics } from '@/lib/generateCharacteristics';

export default function EditCharacteristicsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newVitamin, setNewVitamin] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [characteristics, setCharacteristics] = useState<NutritionCharacteristics | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const data = await getCharacteristicById(id);
        if (data) {
          setCharacteristics(data);
        } else {
          console.error('Plan not found');
          // Redirect to the list page
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!characteristics) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Error: Plan not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/cabinet/characteristics')}
          sx={{ mt: 2 }}
        >
          Return to List
        </Button>
      </Box>
    );
  }

  // Handle text and number inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacteristics(prev => ({
        ...prev!,
        [parent]: {
          ...prev![parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setCharacteristics(prev => ({ ...prev!, [name]: value }));
    }
  };

  // Handle slider changes
  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setCharacteristics(prev => ({
          ...prev!,
          [parent]: {
            ...prev![parent as keyof typeof prev],
            [child]: newValue,
          },
        }));
      } else {
        setCharacteristics(prev => ({ ...prev!, [name]: newValue }));
      }
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCharacteristics(prev => ({ ...prev!, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacteristics(prev => ({
        ...prev!,
        [parent]: {
          ...prev![parent as keyof typeof prev],
          [child]: checked,
        },
      }));
    } else {
      setCharacteristics(prev => ({ ...prev!, [name]: checked }));
    }
  };

  // Handle vitamin/mineral priority change
  const handlePriorityChange = (index: number, priority: string) => {
    const updatedVitamins = [...characteristics.vitaminsAndMinerals];
    updatedVitamins[index].priority = priority;
    setCharacteristics(prev => ({ ...prev!, vitaminsAndMinerals: updatedVitamins }));
  };

  // Add a new vitamin/mineral
  const handleAddVitamin = () => {
    if (newVitamin.trim()) {
      setCharacteristics(prev => ({
        ...prev!,
        vitaminsAndMinerals: [
          ...prev!.vitaminsAndMinerals,
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
    setCharacteristics(prev => ({ ...prev!, vitaminsAndMinerals: updatedVitamins }));
  };

  // Add a new ingredient to avoid
  const handleAddIngredient = () => {
    if (newIngredient.trim() && !characteristics.avoidIngredients.includes(newIngredient)) {
      setCharacteristics(prev => ({
        ...prev!,
        avoidIngredients: [...prev!.avoidIngredients, newIngredient],
      }));
      setNewIngredient('');
    }
  };

  // Remove an ingredient
  const handleRemoveIngredient = (ingredient: string) => {
    setCharacteristics(prev => ({
      ...prev!,
      avoidIngredients: prev!.avoidIngredients.filter(item => item !== ingredient),
    }));
  };

  // Calculate BMR and suggested calories
  const calculateCalories = () => {
    // Mifflin-St Jeor Equation
    const { weight, height, age, activityLevel, goal } = characteristics;

    // BMR calculation
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

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

    setCharacteristics(prev => ({ ...prev!, caloriesTarget }));
  };

  // Save the edited plan
  const handleSave = async () => {
    try {
      // In a real app, you would update via an API call
      // For this example, we'll just simulate success
      console.log('Plan updated:', {
        ...characteristics,
        updatedAt: new Date().toISOString(),
      });

      setSaved(true);

      // Redirect back to the list after a brief delay
      setTimeout(() => {
        router.push('/cabinet/characteristics');
      }, 1500);
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleCancel = () => {
    router.push('/cabinet/characteristics');
  };

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

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Nutrition plan updated successfully! Redirecting...
        </Alert>
      )}

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
            />
          </Grid>

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
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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
              value={characteristics.macroDistribution.protein}
              onChange={handleSliderChange('macroDistribution.protein')}
              min={10}
              max={60}
              step={5}
              valueLabelDisplay="auto"
            />
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
              value={characteristics.macroDistribution.carbs}
              onChange={handleSliderChange('macroDistribution.carbs')}
              min={10}
              max={70}
              step={5}
              valueLabelDisplay="auto"
            />
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
              value={characteristics.macroDistribution.fat}
              onChange={handleSliderChange('macroDistribution.fat')}
              min={10}
              max={60}
              step={5}
              valueLabelDisplay="auto"
            />
          </Grid>

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
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
