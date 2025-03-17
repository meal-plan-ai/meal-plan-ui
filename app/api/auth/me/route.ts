import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extract the cookie from the request headers
    const cookie = request.headers.get('cookie') || '';

    // Make a direct fetch request with the cookie forwarded
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return NextResponse.json(null, { status: 401 });
      }
      throw new Error('Failed to get user data');
    }

    const userData = await backendResponse.json();
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(null, { status: 401 });
  }
} 