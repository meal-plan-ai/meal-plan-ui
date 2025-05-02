'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckoutForm from '@/components/checkout/CheckoutForm';
export type CardDetails = {
  cardNumber: string;
  name: string;
  expiryDate: string;
  cvv: string;
};

export type PaymentMethodProps = {
  selectedMethod: string | null;
  cardDetails: CardDetails | null;
  paypalEmail: string | null;
  onPaymentMethodChange: (method: string) => void;
  onCardDetailsChange: (details: CardDetails) => void;
  onPaypalEmailChange: (email: string) => void;
};

function PaymentMethod() {
  return (
    <Box>
      <CheckoutForm />

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Your payment information is processed securely. We do not store your card details on our
          servers.
        </Typography>
      </Box>
    </Box>
  );
}

export { PaymentMethod };
