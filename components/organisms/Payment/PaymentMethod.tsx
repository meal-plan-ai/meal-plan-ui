'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  TextField,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import { CreditCard, AccountBalanceWallet, Lock } from '@mui/icons-material';
import Image from 'next/image';

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

export default function PaymentMethod({
  selectedMethod,
  cardDetails,
  paypalEmail,
  onPaymentMethodChange,
  onCardDetailsChange,
  onPaypalEmailChange,
}: PaymentMethodProps) {
  const { theme } = useTheme();
  const [errors, setErrors] = useState<Record<string, boolean>>({
    cardNumber: false,
    name: false,
    expiryDate: false,
    cvv: false,
    email: false,
  });

  // Current card details with null safety
  const currentCardDetails = cardDetails || {
    cardNumber: '',
    name: '',
    expiryDate: '',
    cvv: '',
  };

  // Consolidated card detail change handler that validates and formats inputs
  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    let isValid = true;
    let formattedValue = value;

    // Input validation and formatting based on field type
    switch (field) {
      case 'cardNumber':
        // Format: Remove non-digit chars and add spaces
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{4})(?=\d)/g, '$1 ')
          .slice(0, 19); // 16 digits + 3 spaces
        isValid = /^\d{4}( \d{4}){3}$/.test(formattedValue);
        break;

      case 'name':
        // All uppercase for card holder name
        formattedValue = value.toUpperCase();
        isValid = formattedValue.trim().length > 3;
        break;

      case 'expiryDate':
        // Format: MM/YY
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{2})(?=\d)/g, '$1/')
          .slice(0, 5);

        if (formattedValue.length === 5) {
          const [month, year] = formattedValue.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;

          const numMonth = parseInt(month, 10);
          const numYear = parseInt(year, 10);

          isValid =
            numMonth >= 1 &&
            numMonth <= 12 &&
            (numYear > currentYear || (numYear === currentYear && numMonth >= currentMonth));
        } else {
          isValid = false;
        }
        break;

      case 'cvv':
        // CVV: 3-4 digits only
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        isValid = /^\d{3,4}$/.test(formattedValue);
        break;
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [field]: !isValid && formattedValue.length > 0,
    }));

    // Update card details through the parent component
    onCardDetailsChange({
      ...currentCardDetails,
      [field]: formattedValue,
    });
  };

  // Handle PayPal email change with validation
  const handlePaypalEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic email validation regex
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    setErrors(prev => ({
      ...prev,
      email: value.length > 0 && !isValid,
    }));

    onPaypalEmailChange(value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Способ оплаты
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Выберите предпочитаемый способ оплаты для вашей подписки
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          value={selectedMethod || ''}
          onChange={e => onPaymentMethodChange(e.target.value)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  border: selectedMethod === 'card' ? '2px solid' : '1px solid',
                  borderColor: selectedMethod === 'card' ? 'primary.main' : 'divider',
                  backgroundColor:
                    theme === 'dark'
                      ? selectedMethod === 'card'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(38, 50, 56, 0.6)'
                      : selectedMethod === 'card'
                        ? 'rgba(25, 118, 210, 0.04)'
                        : 'white',
                }}
              >
                <CardContent>
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Банковская карта
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />

                  {selectedMethod === 'card' && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Номер карты"
                            variant="outlined"
                            value={currentCardDetails.cardNumber}
                            onChange={e => handleCardDetailChange('cardNumber', e.target.value)}
                            error={errors.cardNumber}
                            helperText={errors.cardNumber ? 'Введите корректный номер карты' : ''}
                            placeholder="0000 0000 0000 0000"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Lock color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Срок действия"
                            variant="outlined"
                            value={currentCardDetails.expiryDate}
                            onChange={e => handleCardDetailChange('expiryDate', e.target.value)}
                            error={errors.expiryDate}
                            helperText={errors.expiryDate ? 'Формат: ММ/ГГ' : ''}
                            placeholder="MM/YY"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="CVV/CVC"
                            variant="outlined"
                            value={currentCardDetails.cvv}
                            onChange={e => handleCardDetailChange('cvv', e.target.value)}
                            error={errors.cvv}
                            helperText={errors.cvv ? 'Введите 3-4 цифры' : ''}
                            placeholder="123"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Lock color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Имя держателя карты"
                            variant="outlined"
                            value={currentCardDetails.name}
                            onChange={e => handleCardDetailChange('name', e.target.value)}
                            error={errors.name}
                            helperText={errors.name ? 'Введите имя как на карте' : ''}
                            placeholder="IVAN IVANOV"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  border: selectedMethod === 'paypal' ? '2px solid' : '1px solid',
                  borderColor: selectedMethod === 'paypal' ? 'primary.main' : 'divider',
                  backgroundColor:
                    theme === 'dark'
                      ? selectedMethod === 'paypal'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(38, 50, 56, 0.6)'
                      : selectedMethod === 'paypal'
                        ? 'rgba(25, 118, 210, 0.04)'
                        : 'white',
                }}
              >
                <CardContent>
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalanceWallet sx={{ mr: 1, color: '#0070ba' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          PayPal
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />

                  {selectedMethod === 'paypal' && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 3 }} />

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Вы будете перенаправлены на сайт PayPal для завершения оплаты после нажатия
                        на кнопку &quot;Оплатить&quot;.
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <Image
                          src="/images/paypal-color.svg"
                          alt="PayPal"
                          width={120}
                          height={60}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Email для PayPal"
                        variant="outlined"
                        value={paypalEmail || ''}
                        onChange={handlePaypalEmailChange}
                        error={errors.email}
                        helperText={errors.email ? 'Введите корректный email' : ''}
                        placeholder="your-email@example.com"
                        sx={{ mt: 2 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Lock sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
        <Typography variant="body2" color="text.secondary">
          Безопасная оплата с шифрованием SSL
        </Typography>
      </Box>
    </Box>
  );
}
