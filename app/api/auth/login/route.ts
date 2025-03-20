import { NextResponse } from 'next/server';
import { LoginRequestDto, LoginResponseDto } from '@/api/query/auth/auth.dto';
import { handleCookiesFromBackend } from '@/utils/cookies';
import { ResponseError } from '@/api/api.types';

export async function POST(request: Request) {
  try {
    const credentials = await request.json() as LoginRequestDto;

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json() as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Authentication failed' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json() as LoginResponseDto;
    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to login' },
      { status: 500 }
    );
  }
}