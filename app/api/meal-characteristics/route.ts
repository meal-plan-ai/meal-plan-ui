import { NextResponse } from 'next/server';
import { nestServerMealCharacteristicsApi } from '@/api/nest-server-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');

    const { data } = await nestServerMealCharacteristicsApi.getAll(page, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meal characteristics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal characteristics' },
      { status: 500 }
    );
  }
}
