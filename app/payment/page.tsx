'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import { CheckoutForm } from '@/components';

export default function PaymentPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payment
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Complete your purchase
          </Typography>

          <CheckoutForm />
        </Paper>
      </Box>
    </Container>
  );
}
