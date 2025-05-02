'use client';

import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { red } from '@mui/material/colors';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <CancelOutlinedIcon sx={{ fontSize: 64, color: red[500], mb: 2 }} />

          <Typography variant="h4" component="h1" gutterBottom>
            Payment Cancelled
          </Typography>

          <Typography variant="body1" paragraph>
            Your payment process was cancelled. No charges were made.
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button component={Link} href="/payment" variant="contained" color="primary">
              Try Again
            </Button>

            <Button component={Link} href="/" variant="outlined">
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
