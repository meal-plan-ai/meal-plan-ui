import { NextResponse } from 'next/server';
import { apiClient } from '@/api/client/api.client';
import { SocialLoginRequestDto } from '@/api/query/auth/auth.dto';

export async function POST(request: Request) {
  try {
    const credentials = await request.json() as SocialLoginRequestDto;

    const response = await apiClient.post('/auth/apple', credentials, { withCredentials: true });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Apple login error:', error);
    return NextResponse.json({ error: 'Failed to login with Apple' }, { status: 500 });
  }
} 