import { NextResponse } from 'next/server';
import { RegisterRequestDto } from '@/api/query/auth/auth.dto';
import { handleCookiesFromBackend } from '@/utils/cookies';

export async function POST(request: Request) {
  try {
    const userData = await request.json() as RegisterRequestDto;

    // Make a direct fetch request to access headers and cookies
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Important for cookies
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const responseData = await backendResponse.json();

    // Get the Set-Cookie header from the backend response
    console.log('Set-Cookie header from register:', backendResponse.headers.get('set-cookie'));

    // Create the response with the data
    const response = NextResponse.json(responseData, { status: 201 });

    // Handle cookies using the utility function
    return handleCookiesFromBackend(response, backendResponse, responseData);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
} 