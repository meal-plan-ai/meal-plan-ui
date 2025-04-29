'use client';

import { Box, Typography, Paper, Grid, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { CreditCard as CreditCardIcon } from '@mui/icons-material';
import { useGetUserSubscription } from '@/api/next-client-api/users/users.hooks';
import { ESubscriptionStatus } from '@/api/nest-server-api/users/users.types';
import { formatDate } from '@/utils';

function getStatusColor(status: ESubscriptionStatus) {
  switch (status) {
    case ESubscriptionStatus.ACTIVE:
      return 'success';
    case ESubscriptionStatus.TRIAL:
      return 'info';
    case ESubscriptionStatus.CANCELLED:
      return 'error';
    case ESubscriptionStatus.EXPIRED:
      return 'warning';
    default:
      return 'default';
  }
}

function formatStatusLabel(status: ESubscriptionStatus) {
  switch (status) {
    case ESubscriptionStatus.ACTIVE:
      return 'Active';
    case ESubscriptionStatus.TRIAL:
      return 'Trial Period';
    case ESubscriptionStatus.CANCELLED:
      return 'Cancelled';
    case ESubscriptionStatus.EXPIRED:
      return 'Expired';
    default:
      return status;
  }
}

export function SubscriptionPage() {
  const { data, isLoading, error } = useGetUserSubscription();

  console.log('data', data);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading subscription: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  if (!data?.hasActiveSubscription) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscription
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No active subscription
          </Typography>
          <Typography variant="body1" paragraph>
            You don&apos;t have an active subscription plan at the moment.
          </Typography>
          <Button variant="contained" color="primary" href="/plans" startIcon={<CreditCardIcon />}>
            View Available Plans
          </Button>
        </Paper>
      </Box>
    );
  }

  const { subscription } = data;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Current Subscription</Typography>
          <Chip
            label={formatStatusLabel(subscription?.status as ESubscriptionStatus)}
            color={getStatusColor(subscription?.status as ESubscriptionStatus)}
            variant="filled"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Subscription ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {subscription?.id}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Plan
            </Typography>
            <Typography variant="body1" gutterBottom>
              {subscription?.plan?.name || 'Standard Plan'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {subscription?.startDate ? formatDate(new Date(subscription.startDate)) : 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {subscription?.endDate ? formatDate(new Date(subscription.endDate)) : 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Auto Renew
            </Typography>
            <Typography variant="body1" gutterBottom>
              {subscription?.autoRenew ? 'Enabled' : 'Disabled'}
            </Typography>
          </Grid>
        </Grid>

        {subscription?.status !== ESubscriptionStatus.CANCELLED && (
          <Box mt={4}>
            <Button variant="outlined" color="error">
              Cancel Subscription
            </Button>
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Payment History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To view your complete payment history, please go to your account settings.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/profile">
          View Payment History
        </Button>
      </Paper>
    </Box>
  );
}

export default SubscriptionPage;
