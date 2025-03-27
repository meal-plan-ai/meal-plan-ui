import { v4 as uuidv4 } from 'uuid';

// Define a type for our meal plan
export interface MealPlan {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  duration: number; // in days
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  dietType: string;
  isActive: boolean;
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  day: number;
  mealType: string; // breakfast, lunch, dinner, snack
  recipes: Recipe[];
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  preparationSteps: string[];
  cookingTime: number; // in minutes
  servings: number;
}

// Sample data
const dietTypes = [
  'Standard',
  'Keto',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Mediterranean',
  'Paleo',
  'Low Carb',
];

const breakfastRecipes = [
  'Avocado Toast with Poached Eggs',
  'Greek Yogurt with Berries and Granola',
  'Vegetable Omelette',
  'Protein Smoothie Bowl',
  'Oatmeal with Nuts and Fruits',
  'Chia Seed Pudding',
  'Whole Grain Pancakes',
  'Breakfast Burrito',
];

const lunchRecipes = [
  'Grilled Chicken Salad',
  'Quinoa Bowl with Roasted Vegetables',
  'Turkey and Avocado Wrap',
  'Lentil Soup with Whole Grain Bread',
  'Tuna Salad Sandwich',
  'Vegetable Stir Fry with Tofu',
  'Mediterranean Mezze Plate',
  'Poke Bowl with Brown Rice',
];

const dinnerRecipes = [
  'Baked Salmon with Asparagus',
  'Chicken Curry with Brown Rice',
  'Beef and Vegetable Stew',
  'Vegetarian Chili',
  'Shrimp Pasta with Zucchini Noodles',
  'Stuffed Bell Peppers',
  'Eggplant Parmesan',
  'Turkey Meatballs with Whole Wheat Pasta',
];

const snackRecipes = [
  'Apple with Almond Butter',
  'Hummus with Vegetable Sticks',
  'Greek Yogurt with Honey',
  'Trail Mix',
  'Protein Bar',
  'Rice Cakes with Avocado',
  'Hard-Boiled Eggs',
  'Cottage Cheese with Berries',
];

function getRandomRecipes(type: string): Recipe {
  let recipeName = '';

  if (type === 'Breakfast') {
    recipeName = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
  } else if (type === 'Lunch') {
    recipeName = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
  } else if (type === 'Dinner') {
    recipeName = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
  } else {
    recipeName = snackRecipes[Math.floor(Math.random() * snackRecipes.length)];
  }

  // Generate random nutrition info
  const calories = Math.floor(
    type === 'Snack' ? 100 + Math.random() * 200 : 300 + Math.random() * 500
  );
  const protein = Math.floor((calories * (0.15 + Math.random() * 0.15)) / 4); // 15-30% of calories from protein
  const fat = Math.floor((calories * (0.25 + Math.random() * 0.15)) / 9); // 25-40% of calories from fat
  const carbs = Math.floor((calories - protein * 4 - fat * 9) / 4); // Remaining calories from carbs

  return {
    id: uuidv4(),
    name: recipeName,
    calories,
    protein,
    carbs,
    fat,
    ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3', 'Ingredient 4'],
    preparationSteps: ['Step 1', 'Step 2', 'Step 3'],
    cookingTime: Math.floor(15 + Math.random() * 45),
    servings: Math.floor(1 + Math.random() * 4),
  };
}

function generateRandomMealPlan(): MealPlan {
  const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
  const updatedDate = new Date(
    Date.parse(createdDate) + Math.random() * 10 * 24 * 60 * 60 * 1000
  ).toISOString();
  const duration = Math.floor(1 + Math.random() * 14); // 1-14 days
  const dietType = dietTypes[Math.floor(Math.random() * dietTypes.length)];
  const targetCalories = Math.floor(1800 + Math.random() * 800); // 1800-2600 calories

  // Calculate macros
  const targetProtein = Math.floor((targetCalories * 0.3) / 4); // 30% of calories from protein
  const targetFat = Math.floor((targetCalories * 0.3) / 9); // 30% of calories from fat
  const targetCarbs = Math.floor((targetCalories * 0.4) / 4); // 40% of calories from carbs

  // Generate meals
  const meals: Meal[] = [];

  for (let day = 1; day <= duration; day++) {
    // Always include breakfast, lunch, and dinner
    const dailyMeals = ['Breakfast', 'Lunch', 'Dinner'];

    // Maybe add 1-2 snacks
    const snackCount = Math.floor(Math.random() * 3); // 0-2 snacks
    for (let i = 0; i < snackCount; i++) {
      dailyMeals.push('Snack');
    }

    // Create each meal for this day
    dailyMeals.forEach(mealType => {
      meals.push({
        id: uuidv4(),
        name: `Day ${day} ${mealType}`,
        day,
        mealType,
        recipes: [getRandomRecipes(mealType)],
      });
    });
  }

  return {
    id: uuidv4(),
    name: `${duration}-Day ${dietType} Meal Plan ${Math.floor(Math.random() * 100)}`,
    createdAt: createdDate,
    updatedAt: updatedDate,
    duration,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    dietType,
    isActive: Math.random() > 0.7, // 30% chance of being active
    meals,
  };
}

// Generate 50 random meal plans
export function generateSampleMealPlans(): MealPlan[] {
  const plans: MealPlan[] = [];
  for (let i = 0; i < 50; i++) {
    plans.push(generateRandomMealPlan());
  }
  return plans;
}
