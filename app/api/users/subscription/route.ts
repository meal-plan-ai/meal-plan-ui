import { nestServerUsersApi } from '@/api/nest-server-api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching user subscription');
    const { data } = await nestServerUsersApi.getUserSubscription();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch user subscription' }, { status: 500 });
  }
}
