import { NextResponse } from 'next/server';
import { nestServerMealPlanApi } from '@/api/nest-server-api';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await nestServerMealPlanApi.generateAiPlan(id);

  return NextResponse.json(data);
}
