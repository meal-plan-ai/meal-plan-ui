'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Typography, Box, Paper, Button, Card, CardContent, Divider } from '@mui/material';
import { CheckCircleOutline, AccessTime, CalendarToday, Email } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface PaymentSuccessProps {
  plan: {
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'annually';
    description: string;
  } | null;
}

export default function PaymentSuccess({ plan }: PaymentSuccessProps) {
  const { theme } = useTheme();
  const router = useRouter();

  if (!plan) {
    return null;
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getSubscriptionEndDate = () => {
    const today = new Date();

    if (plan.interval === 'monthly') {
      return new Date(today.setMonth(today.getMonth() + 1));
    } else {
      return new Date(today.setFullYear(today.getFullYear() + 1));
    }
  };

  const handleGoToDashboard = () => {
    router.push('/cabinet');
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <CheckCircleOutline
        sx={{
          fontSize: 80,
          color: 'success.main',
          mb: 2,
        }}
      />

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme === 'dark' ? 'primary.light' : 'primary.dark',
        }}
      >
        Payment successful!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme === 'dark' ? 'grey.300' : 'grey.700',
          mb: 4,
        }}
      >
        Thank you for purchasing the subscription. Your subscription has been activated and is ready
        to use.
      </Typography>

      <Card
        elevation={2}
        sx={{
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme === 'dark' ? 'rgba(38, 50, 56, 0.6)' : 'white',
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Details of your subscription
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Plan:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {plan.name}
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Period:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {plan.interval === 'monthly' ? 'Monthly' : 'Annually'}
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Next payment date:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(getSubscriptionEndDate())}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Cost:
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${formatPrice(plan.price)}
                <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
                  {plan.interval === 'monthly' ? '/месяц' : '/год'}
                </Typography>
              </Typography>
              {plan.interval === 'annually' && (
                <Typography variant="body2" color="success.main">
                  ${formatPrice(plan.price / 12)}/month
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Email sx={{ mr: 1, color: 'info.main' }} />
        <Typography variant="body2" color="text.secondary">
          Detailed information has been sent to your email
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor:
            theme === 'dark' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.04)',
          borderRadius: 2,
          maxWidth: 500,
          mx: 'auto',
          mb: 4,
          border: '1px dashed',
          borderColor: 'primary.main',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Advice:</strong> You can manage your subscription in your personal account in the
          &quot;Subscription&quot; section.
        </Typography>
        <Typography variant="body2">
          To cancel auto-renewal, please do it at least 24 hours before the next payment date.
        </Typography>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGoToDashboard}
        sx={{ minWidth: 200, py: 1.5 }}
      >
        Go to personal account
      </Button>
    </Box>
  );
}
