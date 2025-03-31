import { NextResponse } from 'next/server';
import { NewPasswordRequestDto } from '@/api/nest-server-api/auth/auth.types';
import { nestServerAuthApi } from '@/api/nest-server-api';
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as NewPasswordRequestDto;

    await nestServerAuthApi.changePassword(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
