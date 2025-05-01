import { nestServerSubscriptionApi } from '@/api/nest-server-api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data } = await nestServerSubscriptionApi.getUserSubscriptionStatus();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get user subscription error:', error);
    return NextResponse.json({ error: 'Failed to get user subscription' }, { status: 500 });
  }
}
