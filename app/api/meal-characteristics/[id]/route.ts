import { NextResponse } from 'next/server';
import { ResponseError } from '@/api/api.types';
import { handleCookiesFromBackend } from '@/utils/cookies';
import {
  UpdateMealCharacteristicRequestDto,
  MealCharacteristicResponseDto,
} from '@/api/query/meal-characteristics/meal-characteristics.dto';

// GET a single meal characteristic by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/meal-characteristics/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json()) as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch meal characteristic' },
        { status: backendResponse.status }
      );
    }

    const responseData = (await backendResponse.json()) as MealCharacteristicResponseDto;
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Error fetching meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal characteristic' },
      { status: 500 }
    );
  }
}

// PUT update a meal characteristic
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = (await request.json()) as UpdateMealCharacteristicRequestDto;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/meal-characteristics/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }
    );

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json()) as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Failed to update meal characteristic' },
        { status: backendResponse.status }
      );
    }

    const responseData = (await backendResponse.json()) as MealCharacteristicResponseDto;
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Error updating meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update meal characteristic' },
      { status: 500 }
    );
  }
}

// DELETE a meal characteristic
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/meal-characteristics/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json()) as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Failed to delete meal characteristic' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json();
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Error deleting meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete meal characteristic' },
      { status: 500 }
    );
  }
}
