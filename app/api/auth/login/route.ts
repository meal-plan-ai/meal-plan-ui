import { NextResponse } from 'next/server';
import { LoginRequestDto } from '@/api/query/auth/auth.dto';
import { handleCookiesFromBackend } from '@/utils/cookies';

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
      const errorData = await backendResponse.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const responseData = await backendResponse.json();

    const response = NextResponse.json(responseData);

    return handleCookiesFromBackend(response, backendResponse, responseData);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
} 