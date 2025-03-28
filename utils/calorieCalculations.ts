import { ActivityLevel, Goal } from '@/api/query/meal-characteristics/meal-characteristics.dto';

interface CalorieCalculationParams {
  weight?: number;
  height?: number;
  age?: number;
  activityLevel?: ActivityLevel;
  activityCalories?: number;
  goal?: Goal;
}

export function calculateCalories({
  weight,
  height,
  age,
  activityLevel,
  activityCalories,
  goal,
}: CalorieCalculationParams): number | undefined {
  if (!weight || !height || !age) {
    return undefined; // Return undefined if required values are missing
  }

  // Calculate BMR
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  let targetDailyCalories: number;

  // Check if using manual activity calories
  if (activityCalories !== undefined) {
    targetDailyCalories = Math.round(bmr + activityCalories);
  } else {
    // Use activity multiplier
    let activityMultiplier;
    switch (activityLevel) {
      case ActivityLevel.SEDENTARY:
        activityMultiplier = 1.2;
        break;
      case ActivityLevel.LIGHT:
        activityMultiplier = 1.375;
        break;
      case ActivityLevel.MODERATE:
        activityMultiplier = 1.55;
        break;
      case ActivityLevel.ACTIVE:
        activityMultiplier = 1.725;
        break;
      case ActivityLevel.VERY_ACTIVE:
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.55;
    }
    targetDailyCalories = Math.round(bmr * activityMultiplier);
  }

  // Goal adjustment
  if (goal) {
    switch (goal) {
      case Goal.WEIGHT_LOSS:
        targetDailyCalories = Math.round(targetDailyCalories * 0.8);
        break;
      case Goal.MUSCLE_GAIN:
        targetDailyCalories = Math.round(targetDailyCalories * 1.15);
        break;
    }
  }

  return targetDailyCalories;
}
