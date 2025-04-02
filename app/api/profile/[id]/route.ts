import { NextResponse } from 'next/server';
import { nestServerProfileApi } from '@/api/nest-server-api';
import { AxiosError } from 'axios';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    try {
      const { data: updatedProfile } = await nestServerProfileApi.updateProfile(id, data);

      return NextResponse.json(updatedProfile, { status: 200 });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        throw new Error('Failed to update profile');
      }
      throw error;
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
