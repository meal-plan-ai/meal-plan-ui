import { v4 as uuidv4 } from 'uuid';

// Define a type for our nutrition characteristics
export interface NutritionCharacteristics {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Basic information
  weight: number; // in kg
  height: number; // in cm
  age: number;
  activityLevel: string;
  goal: string;

  // Caloric and macronutrient targets
  caloriesTarget: number;
  macroDistribution: {
    protein: number; // percentage
    carbs: number; // percentage
    fat: number; // percentage
  };

  // Meal frequency
  mealsPerDay: number;
  includingSnacks: boolean;

  // Specific nutritional requirements
  nutrientTargets: {
    fiber: number; // in grams
    sugar: number; // in grams
    sodium: number; // in mg
  };

  // Vitamin and mineral focus
  vitaminsAndMinerals: Array<{ name: string; priority: string }>;

  // Dietary restrictions
  avoidIngredients: string[];

  // Additional preferences
  preferences: {
    organic: boolean;
    seasonal: boolean;
    localProduce: boolean;
    sustainableSeafood: boolean;
    budgetFriendly: boolean;
  };
}

// Names for generated plans
const planNames = [
  'Weight Loss Plan',
  'Muscle Building',
  'Maintenance Diet',
  'Low Carb Lifestyle',
  'High Protein Plan',
  'Balanced Nutrition',
  'Keto Approach',
  'Mediterranean Style',
  'Plant-Based Focus',
  'Athletic Performance',
  'Office Worker Plan',
  'Recovery Diet',
];

// Generate a single random plan
export function generateRandomPlan(): NutritionCharacteristics {
  const randomDate = (start: Date, end: Date) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toISOString();
  };

  const createdDate = randomDate(new Date(2023, 0, 1), new Date());
  const updatedDate = randomDate(new Date(createdDate), new Date());

  const weight = Math.floor(50 + Math.random() * 70); // 50-120kg
  const height = Math.floor(150 + Math.random() * 50); // 150-200cm
  const age = Math.floor(18 + Math.random() * 62); // 18-80 years

  const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'veryActive'];
  const goals = ['lose', 'maintain', 'gain'];

  const vitamins = [
    'Vitamin A',
    'Vitamin B1',
    'Vitamin B2',
    'Vitamin B3',
    'Vitamin B5',
    'Vitamin B6',
    'Vitamin B7',
    'Vitamin B9',
    'Vitamin B12',
    'Vitamin C',
    'Vitamin D',
    'Vitamin E',
    'Vitamin K',
    'Calcium',
    'Iron',
    'Magnesium',
    'Potassium',
    'Zinc',
    'Selenium',
    'Iodine',
  ];

  const ingredients = [
    'Shellfish',
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Eggs',
    'Wheat',
    'Soy',
    'Fish',
    'Corn',
    'Gluten',
    'Sesame',
    'Sulfites',
    'MSG',
    'Artificial Colors',
    'Artificial Sweeteners',
    'Pork',
    'Beef',
    'Caffeine',
    'Alcohol',
  ];

  // Basic BMR calculation (Mifflin-St Jeor)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  // Apply activity multiplier
  const activityLevel = activityLevels[Math.floor(Math.random() * activityLevels.length)];
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

  // Apply goal adjustment
  const goal = goals[Math.floor(Math.random() * goals.length)];
  switch (goal) {
    case 'lose':
      caloriesTarget = Math.round(caloriesTarget * 0.8);
      break;
    case 'gain':
      caloriesTarget = Math.round(caloriesTarget * 1.15);
      break;
  }

  // Generate random macros that sum to 100
  let protein = Math.floor(20 + Math.random() * 30); // 20-50%
  let fat = Math.floor(20 + Math.random() * 30); // 20-50%
  let carbs = 100 - protein - fat;

  // Ensure valid values
  if (carbs < 10) {
    const deficit = 10 - carbs;
    protein -= Math.floor(deficit / 2);
    fat -= Math.ceil(deficit / 2);
    carbs = 10;
  }

  // Generate random vitamin/mineral priorities
  const numVitamins = Math.floor(2 + Math.random() * 4); // 2-5 vitamins
  const selectedVitamins = new Set();
  while (selectedVitamins.size < numVitamins) {
    selectedVitamins.add(vitamins[Math.floor(Math.random() * vitamins.length)]);
  }

  const priorities = ['low', 'medium', 'high'];
  const vitaminsAndMinerals = Array.from(selectedVitamins).map(name => ({
    name: name as string,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
  }));

  // Generate random avoided ingredients
  const numIngredients = Math.floor(Math.random() * 4); // 0-3 ingredients
  const avoidIngredients = [];
  const usedIngredients = new Set();
  for (let i = 0; i < numIngredients; i++) {
    let ingredient;
    do {
      ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    } while (usedIngredients.has(ingredient));
    usedIngredients.add(ingredient);
    avoidIngredients.push(ingredient);
  }

  return {
    id: uuidv4(),
    name:
      planNames[Math.floor(Math.random() * planNames.length)] +
      ' ' +
      Math.floor(Math.random() * 10),
    createdAt: createdDate,
    updatedAt: updatedDate,
    weight,
    height,
    age,
    activityLevel,
    goal,
    caloriesTarget,
    macroDistribution: {
      protein,
      carbs,
      fat,
    },
    mealsPerDay: Math.floor(2 + Math.random() * 4), // 2-5 meals
    includingSnacks: Math.random() > 0.5,
    nutrientTargets: {
      fiber: Math.floor(15 + Math.random() * 20), // 15-35g
      sugar: Math.floor(15 + Math.random() * 30), // 15-45g
      sodium: Math.floor(1500 + Math.random() * 1500), // 1500-3000mg
    },
    vitaminsAndMinerals,
    avoidIngredients,
    preferences: {
      organic: Math.random() > 0.5,
      seasonal: Math.random() > 0.5,
      localProduce: Math.random() > 0.5,
      sustainableSeafood: Math.random() > 0.5,
      budgetFriendly: Math.random() > 0.5,
    },
  };
}

// Generate 50 random plans
export function generateSamplePlans(): NutritionCharacteristics[] {
  const plans: NutritionCharacteristics[] = [];
  for (let i = 0; i < 50; i++) {
    plans.push(generateRandomPlan());
  }
  return plans;
}
