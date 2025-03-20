import { NextResponse } from 'next/server';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/query/auth/auth.dto';
import { handleCookiesFromBackend } from '@/utils/cookies';
import { ResponseError } from '@/api/api.types';

export async function POST(request: Request) {
  try {
    const userData = await request.json() as RegisterRequestDto;

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json() as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Registration failed' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json() as RegisterResponseDto;
    const response = NextResponse.json(responseData, { status: 201 });

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to register' }, { status: 500 });
  }
}