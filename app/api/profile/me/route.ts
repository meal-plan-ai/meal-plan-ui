import { NextResponse } from 'next/server';
import { nestServerProfileApi } from '@/api/nest-server-api';
import { AxiosError } from 'axios';

export async function GET() {
  try {
    const { data } = await nestServerProfileApi.getMyProfile();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Get profile error:', error);

    const axiosError = error as AxiosError;
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        return NextResponse.json(null, { status: 401 });
      }
    }

    return NextResponse.json(null, { status: 500 });
  }
}
