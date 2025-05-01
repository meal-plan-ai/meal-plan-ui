'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ReceiptLong, CreditCard, AccountBalanceWallet } from '@mui/icons-material';

interface PaymentSummaryProps {
  plan: {
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'annually';
    description: string;
  } | null;
  paymentMethod: {
    type: 'card' | 'paypal';
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    name?: string;
    paypalEmail?: string;
  } | null;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

function PaymentSummary({ plan, paymentMethod, onSubmit, loading, error }: PaymentSummaryProps) {
  const { theme } = useTheme();

  if (!plan) {
    return (
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Please select a subscription plan before checkout
        </Typography>
      </Card>
    );
  }

  if (!paymentMethod) {
    return (
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Please select a payment method before checkout
        </Typography>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    // Only show last 4 digits for security
    const lastFourDigits = cardNumber.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Order Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 2,
          backgroundColor: theme === 'dark' ? 'rgba(38, 50, 56, 0.6)' : 'white',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptLong sx={{ mr: 1, color: 'primary.main' }} />
            Subscription Details
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Plan:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {plan.name}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Period:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {plan.interval === 'monthly' ? 'Monthly' : 'Annually'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Description:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{plan.description}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Price:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ${formatPrice(plan.price)}
                {plan.interval === 'monthly' ? '/month' : '/year'}
              </Typography>
              {plan.interval === 'annually' && (
                <Typography variant="body2" color="success.main">
                  ${formatPrice(plan.price / 12)}/month (with annual payment)
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 2,
          backgroundColor: theme === 'dark' ? 'rgba(38, 50, 56, 0.6)' : 'white',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            {paymentMethod.type === 'card' ? (
              <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
            ) : (
              <AccountBalanceWallet sx={{ mr: 1, color: '#0070ba' }} />
            )}
            Payment Method
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Method:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {paymentMethod.type === 'card' ? 'Credit Card' : 'PayPal'}
              </Typography>
            </Grid>

            {paymentMethod.type === 'card' && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Card Number:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formatCardNumber(paymentMethod.cardNumber)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Cardholder Name:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{paymentMethod.name}</Typography>
                </Grid>
              </>
            )}

            {paymentMethod.type === 'paypal' && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {paymentMethod.paypalEmail || 'Not provided'}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor:
            theme === 'dark' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.04)',
          border: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h6">Total Payment:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              ${formatPrice(plan.price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {plan.interval === 'monthly' ? 'per month' : 'per year'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={loading}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            'Complete Payment'
          )}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By completing this payment, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Box>
    </Box>
  );
}

export { PaymentSummary };
