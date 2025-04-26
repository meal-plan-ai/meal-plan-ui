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

export default function PaymentSummary({
  plan,
  paymentMethod,
  onSubmit,
  loading,
  error,
}: PaymentSummaryProps) {
  const { theme } = useTheme();

  if (!plan) {
    return (
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Выберите план подписки перед оформлением заказа
        </Typography>
      </Card>
    );
  }

  if (!paymentMethod) {
    return (
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Выберите способ оплаты перед оформлением заказа
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
        Детали заказа
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
            Детали подписки
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                План:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {plan.name}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Период:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {plan.interval === 'monthly' ? 'Ежемесячно' : 'Ежегодно'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Описание:
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
                Стоимость:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ${formatPrice(plan.price)}
                {plan.interval === 'monthly' ? '/месяц' : '/год'}
              </Typography>
              {plan.interval === 'annually' && (
                <Typography variant="body2" color="success.main">
                  ${formatPrice(plan.price / 12)}/месяц (при годовой оплате)
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
            Способ оплаты
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Метод:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {paymentMethod.type === 'card' ? 'Банковская карта' : 'PayPal'}
              </Typography>
            </Grid>

            {paymentMethod.type === 'card' && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Номер карты:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formatCardNumber(paymentMethod.cardNumber)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Имя держателя:
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
                    {paymentMethod.paypalEmail || 'Не указан'}
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
            <Typography variant="h6">Итого к оплате:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'right' }}
            >
              ${formatPrice(plan.price)}
              <Typography component="span" variant="body1" sx={{ ml: 1 }}>
                {plan.interval === 'monthly' ? '/месяц' : '/год'}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Нажимая кнопку &quot;Оплатить&quot;, вы соглашаетесь с условиями подписки и правилами
          сервиса.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onSubmit}
          disabled={loading}
          sx={{ minWidth: 200, py: 1.5 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Обработка...
            </>
          ) : (
            'Оплатить'
          )}
        </Button>
      </Box>
    </Box>
  );
}
