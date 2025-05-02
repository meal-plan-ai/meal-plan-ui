import { nestServerSubscriptionApi } from '@/api/nest-server-api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = await nestServerSubscriptionApi.purchaseSubscription(body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Purchase subscription error:', error);

    // Get more details from the error
    let errorMessage = 'Failed to purchase subscription';
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      errorMessage = error.response.data?.message || errorMessage;
      statusCode = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      errorMessage = 'No response from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
