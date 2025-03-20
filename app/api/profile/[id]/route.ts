import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const cookie = request.headers.get('cookie') || '';

    const data = await request.json();
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/profile/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw new Error('Failed to update profile');
    }

    const updatedProfile = await backendResponse.json();
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
