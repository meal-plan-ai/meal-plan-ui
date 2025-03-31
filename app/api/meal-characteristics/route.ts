import { NextResponse } from 'next/server';
import { ResponseError } from '@/api/api.types';
import { handleCookiesFromBackend } from '@/utils/cookies';
import {
  CreateMealCharacteristicRequestDto,
  MealCharacteristicResponseDto,
} from '@/api/query/meal-characteristics/meal-characteristics.dto';

// GET all meal characteristics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/meal-characteristics?page=${page}&limit=${limit}`,
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
        { error: errorData.message || 'Failed to fetch meal characteristics' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json();
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Error fetching meal characteristics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal characteristics' },
      { status: 500 }
    );
  }
}

// POST create new meal characteristic
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateMealCharacteristicRequestDto;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/meal-characteristics`,
      {
        method: 'POST',
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
        { error: errorData.message || 'Failed to create meal characteristic' },
        { status: backendResponse.status }
      );
    }

    const responseData = (await backendResponse.json()) as MealCharacteristicResponseDto;
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Error creating meal characteristic:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create meal characteristic' },
      { status: 500 }
    );
  }
}
