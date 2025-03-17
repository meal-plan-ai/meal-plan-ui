import { NextResponse } from 'next/server';
import { handleLogoutCookies } from '@/utils/cookies';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.error || 'Logout failed');
    }

    const response = NextResponse.json({ success: true });

    return handleLogoutCookies(response, backendResponse);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
} 