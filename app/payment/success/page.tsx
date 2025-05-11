'use client';

import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { green } from '@mui/material/colors';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: green[500], mb: 2 }} />

          <Typography variant="h4" component="h1" gutterBottom>
            Payment Successful!
          </Typography>

          <Typography variant="body1" paragraph>
            Thank you for your purchase. Your payment has been processed successfully.
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            A confirmation has been sent to your email.
          </Typography>

          <Button component={Link} href="/" variant="contained" color="primary" sx={{ mt: 2 }}>
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
