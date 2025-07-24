import { NextResponse } from 'next/server';
import { nestServerMealCharacteristicsApi } from '@/api/nest-server-api';
import { AxiosError } from 'axios';
import { IResponseError } from '@/api/api.types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data } = await nestServerMealCharacteristicsApi.getById(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching meal characteristic:', error);

    // Type guard for AxiosError
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as IResponseError;
      return NextResponse.json(errorData || { error: 'Failed to fetch meal characteristic' }, {
        status: error.response.status,
      });
    }

    // Default error response
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

    // Type guard for AxiosError
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as IResponseError;
      return NextResponse.json(errorData || { error: 'Failed to delete meal characteristic' }, {
        status: error.response.status,
      });
    }

    // Default error response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete meal characteristic' },
      { status: 500 }
    );
  }
}
