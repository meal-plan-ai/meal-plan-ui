import { NextResponse } from 'next/server';
import { nestServerMealPlanApi } from '@/api/nest-server-api';

export async function GET() {
  try {
    const { data } = await nestServerMealPlanApi.getUserPlans();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user meal plans:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user meal plans' },
      { status: 500 }
    );
  }
}
