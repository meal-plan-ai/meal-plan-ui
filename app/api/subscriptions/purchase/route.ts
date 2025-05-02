import { nestServerSubscriptionApi } from '@/api/nest-server-api';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = await nestServerSubscriptionApi.purchaseSubscription(body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Purchase subscription error:', error);
    let errorMessage = 'Failed to purchase subscription';
    let statusCode = 500;

    if (error instanceof AxiosError && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      statusCode = error.response.status || statusCode;
    } else if (error instanceof AxiosError && error.request) {
      errorMessage = 'No response from server';
    } else {
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
