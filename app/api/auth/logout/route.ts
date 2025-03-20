import { NextResponse } from 'next/server';
import { handleLogoutCookies } from '@/utils/cookies';
import { LogoutResponseDto } from '@/api/query/auth/auth.dto';
import { ResponseError } from '@/api/api.types';

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
      const errorData = await backendResponse.json() as ResponseError;

      return NextResponse.json(
        { error: errorData.message || 'Authentication failed' },
        {
          status: backendResponse.status,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        }
      );
    }

    const responseData = await backendResponse.json() as LogoutResponseDto;
    const response = NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

    return handleLogoutCookies(response, backendResponse);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  }
}