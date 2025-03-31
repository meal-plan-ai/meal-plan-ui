import { NextResponse } from 'next/server';
import { nestServerUsersApi } from '@/api/nest-server-api';
import { AxiosError } from 'axios';

export async function GET() {
  try {
    const { data } = await nestServerUsersApi.getCurrentUser();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Get current user error:', error);

    const axiosError = error as AxiosError;
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        return NextResponse.json(null, { status: 401 });
      }
    }

    return NextResponse.json(null, { status: 500 });
  }
}
