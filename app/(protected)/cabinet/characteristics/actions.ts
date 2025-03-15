'use server';

import { generateSamplePlans, NutritionCharacteristics } from '@/lib/generateCharacteristics';

// In a real app, this would be a database query
let plans: NutritionCharacteristics[] | null = null;

export async function getCharacteristics(page = 1, pageSize = 10) {
  // Initialize plans if not already done
  if (!plans) {
    plans = generateSamplePlans();
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

export async function deleteCharacteristic(id: string) {
  if (!plans) {
    plans = generateSamplePlans();
  }

  const index = plans.findIndex(plan => plan.id === id);
  if (index !== -1) {
    plans.splice(index, 1);
    return { success: true };
  }

  return { success: false, error: 'Plan not found' };
}

export async function getCharacteristicById(id: string) {
  if (!plans) {
    plans = generateSamplePlans();
  }

  const plan = plans.find(plan => plan.id === id);
  return plan || null;
}
