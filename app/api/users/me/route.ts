import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        credentials: 'include',
      }
    );

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return NextResponse.json(null, { status: 401 });
      }
      throw new Error('Failed to get current user data');
    }

    const userData = await backendResponse.json();

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
