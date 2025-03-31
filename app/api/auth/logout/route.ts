import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nestServerAuthApi } from '@/api/nest-server-api';

export async function POST() {
  try {
    await nestServerAuthApi.logout();

    const cookieStore = await cookies();

    cookieStore.set('token', '', {
      expires: new Date(0),
      path: '/',
    });

    cookieStore.set('isAuthenticated', '', {
      httpOnly: false,
      expires: new Date(0),
      path: '/',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
