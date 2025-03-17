import { NextResponse } from 'next/server';
import { apiClient } from '@/api/client/api.client';
import { ResetPasswordRequestDto } from '@/api/query/auth/auth.dto';

export async function POST(request: Request) {
  try {
    const data = await request.json() as ResetPasswordRequestDto;

    await apiClient.post('/auth/reset-password', data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
} 