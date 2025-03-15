'use server';

import { generateSampleMealPlans, MealPlan } from '@/lib/generateMealPlans';

// In a real app, this would be a database query
let plans: MealPlan[] | null = null;

export async function getMealPlans(page = 1, pageSize = 10) {
  // Initialize plans if not already done
  if (!plans) {
    plans = generateSampleMealPlans();
  }

  const total = plans.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: plans.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

export async function deleteMealPlan(id: string) {
  if (!plans) {
    plans = generateSampleMealPlans();
  }

  const index = plans.findIndex(plan => plan.id === id);
  if (index !== -1) {
    plans.splice(index, 1);
    return { success: true };
  }

  return { success: false, error: 'Plan not found' };
}

export async function getMealPlanById(id: string) {
  if (!plans) {
    plans = generateSampleMealPlans();
  }

  const plan = plans.find(plan => plan.id === id);
  return plan || null;
}
