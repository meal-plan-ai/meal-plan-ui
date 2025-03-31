import { NextResponse } from 'next/server';
import { nestServerMealCharacteristicsApi } from '@/api/nest-server-api';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data } = await nestServerMealCharacteristicsApi.getById(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal characteristic' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data } = await nestServerMealCharacteristicsApi.delete(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete meal characteristic' },
      { status: 500 }
    );
  }
}
