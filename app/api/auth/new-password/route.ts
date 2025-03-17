import { NextResponse } from 'next/server';
import { apiClient } from '@/api/client/api.client';
import { NewPasswordDto } from '@/api/query/auth/auth.dto';

export async function POST(request: Request) {
  try {
    const data = await request.json() as NewPasswordDto;

    await apiClient.post('/auth/new-password', data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Set new password error:', error);
    return NextResponse.json({ error: 'Failed to set new password' }, { status: 500 });
  }
} 