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
import { Lock } from '@mui/icons-material';

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

function PaymentMethod({
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
        Payment Method
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose your preferred payment method for your subscription
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
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Credit Card
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
                            label="Card Number"
                            variant="outlined"
                            value={currentCardDetails.cardNumber}
                            onChange={e => handleCardDetailChange('cardNumber', e.target.value)}
                            error={errors.cardNumber}
                            helperText={errors.cardNumber ? 'Enter a valid card number' : ''}
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

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Cardholder Name"
                            variant="outlined"
                            value={currentCardDetails.name}
                            onChange={e => handleCardDetailChange('name', e.target.value)}
                            error={errors.name}
                            helperText={
                              errors.name ? 'Enter the name as it appears on the card' : ''
                            }
                            placeholder="JOHN DOE"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            variant="outlined"
                            value={currentCardDetails.expiryDate}
                            onChange={e => handleCardDetailChange('expiryDate', e.target.value)}
                            error={errors.expiryDate}
                            helperText={errors.expiryDate ? 'Format: MM/YY' : ''}
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
                            helperText={errors.cvv ? 'Enter 3-4 digits' : ''}
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
                      </Grid>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Your payment information is secure and encrypted
                        </Typography>
                      </Box>
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

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="PayPal Email"
                            variant="outlined"
                            value={paypalEmail || ''}
                            onChange={handlePaypalEmailChange}
                            error={errors.email}
                            helperText={errors.email ? 'Enter a valid email address' : ''}
                            placeholder="email@example.com"
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          You will be redirected to PayPal to complete your payment
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>

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
