import { NextResponse } from 'next/server';
import { NewPasswordRequestDto } from '@/api/query/auth/auth.dto';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';

    const data = await request.json() as NewPasswordRequestDto;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/new-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to change password' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}