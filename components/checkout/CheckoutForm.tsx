'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Typography, Card } from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_TEST || '');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js не загружен
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // URL куда перенаправлять после платежа
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: 'John Doe',
                email: 'john@example.com',
              },
            },
          }}
        />
      </Box>

      {message && (
        <Typography color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isProcessing || !stripe || !elements}
        sx={{ mt: 2 }}
      >
        {isProcessing ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>
    </form>
  );
}

export default function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_NEST_SERVER_URL || 'http://localhost:3099/api';
        const response = await fetch(`${apiUrl}/stripe/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment session');
        }

        setClientSecret(data.checkoutSessionClientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading payment form
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      )}
    </Card>
  );
}
