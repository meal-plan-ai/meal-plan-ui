import { NextResponse } from 'next/server';
import { nestServerMealPlanApi } from '@/api/nest-server-api';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data } = await nestServerMealPlanApi.getById(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data } = await nestServerMealPlanApi.delete(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete meal plan' },
      { status: 500 }
    );
  }
}
