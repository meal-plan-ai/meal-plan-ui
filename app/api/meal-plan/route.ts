import { NextResponse } from 'next/server';
import { nestServerMealPlanApi } from '@/api/nest-server-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');

    const { data } = await nestServerMealPlanApi.getAll(page, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
}
