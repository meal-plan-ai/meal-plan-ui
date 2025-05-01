'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import {
  PlanSelection,
  PaymentMethod,
  PaymentSummary,
  PaymentSuccess,
  CardDetails,
} from '@/components/organisms/Payment';
// Define interface for our plan structure
interface PlanData {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annually';
  description: string;
}

// These would typically come from an API
const AVAILABLE_PLANS = [
  {
    id: 'basic-monthly',
    name: 'Basic Plan',
    price: 9.99,
    interval: 'monthly' as const,
    description: 'Access to basic features. Ideal for beginners.',
    features: [
      'Up to 10 recipes per month',
      'Basic meal planning',
      'Recipes with minimal ingredients',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium Plan',
    price: 19.99,
    interval: 'monthly' as const,
    description: 'Extended access to features. For a serious approach to nutrition.',
    features: [
      'Unlimited recipes',
      'Advanced meal planning',
      'Automatic product selection',
      'Calculation of calories and nutrients',
    ],
  },
  {
    id: 'basic-annually',
    name: 'Basic Annual Plan',
    price: 99.99,
    interval: 'annually' as const,
    description: 'Basic plan with annual payment. Save 20%.',
    features: [
      'Up to 10 recipes per month',
      'Basic meal planning',
      'Recipes with minimal ingredients',
      'Save 20% with annual payment',
    ],
  },
  {
    id: 'premium-annually',
    name: 'Premium Annual Plan',
    price: 199.99,
    interval: 'annually' as const,
    description: 'Premium plan with annual payment. Save 20%.',
    features: [
      'Unlimited recipes',
      'Advanced meal planning',
      'Automatic product selection',
      'Calculation of calories and nutrients',
      'Save 20% with annual payment',
    ],
  },
];

const steps = ['Plan Selection', 'Payment Method', 'Confirmation'];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const initialPlanId = searchParams.get('plan');

  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [paypalEmail, setPaypalEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete] = useState(false);

  // Set initial plan from URL if available
  useEffect(() => {
    if (initialPlanId) {
      const plan = AVAILABLE_PLANS.find(p => p.id === initialPlanId);
      if (plan) {
        // Convert to PlanData format (without features)
        setSelectedPlan({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          interval: plan.interval,
          description: plan.description,
        });
        setActiveStep(1); // Skip to payment method step
      }
    }
  }, [initialPlanId]);

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }

    if (activeStep === 1) {
      if (!paymentMethod) {
        setError('Please select a payment method');
        return;
      }

      if (paymentMethod === 'card') {
        if (
          !cardDetails ||
          !cardDetails.cardNumber ||
          !cardDetails.name ||
          !cardDetails.expiryDate ||
          !cardDetails.cvv
        ) {
          setError('Please fill in all card details');
          return;
        }
      }

      if (paymentMethod === 'paypal' && !paypalEmail) {
        setError('Please enter email for PayPal');
        return;
      }
    }

    setError(null);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    setError(null);
  };

  const handlePlanSelect = useCallback((plan: PlanData | null) => {
    setSelectedPlan(plan);
    setError(null);
  }, []);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleCardDetailsChange = (details: CardDetails) => {
    setCardDetails(details);
    setError(null);
  };

  const handlePaypalEmailChange = (email: string) => {
    setPaypalEmail(email);
    setError(null);
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('handleSubmitPayment selectedPlan', selectedPlan);
      // In a real application, this would be an API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Payment successful, redirect to dashboard or show success page
      // setOrderComplete(true);

      // Track conversion (in a real app)
      // analytics.track('payment_completed', { plan: selectedPlan.id, amount: selectedPlan.price });
    } catch (err) {
      setError('An error occurred while processing the payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PlanSelection selectedPlan={selectedPlan} onSelectPlan={handlePlanSelect} />;
      case 1:
        return (
          <PaymentMethod
            selectedMethod={paymentMethod}
            cardDetails={cardDetails}
            paypalEmail={paypalEmail}
            onPaymentMethodChange={handlePaymentMethodChange}
            onCardDetailsChange={handleCardDetailsChange}
            onPaypalEmailChange={handlePaypalEmailChange}
          />
        );
      case 2:
        return (
          <PaymentSummary
            plan={selectedPlan}
            paymentMethod={{
              type: paymentMethod as 'card' | 'paypal',
              ...(paymentMethod === 'card' ? cardDetails : {}),
              ...(paymentMethod === 'paypal' ? { paypalEmail: paypalEmail || undefined } : {}),
            }}
            onSubmit={handleSubmitPayment}
            loading={loading}
            error={error}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (orderComplete) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <PaymentSuccess plan={selectedPlan} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Subscription Checkout
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a suitable plan and payment method
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" disabled={activeStep === 0 || loading} onClick={handleBack}>
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : null}
        </Box>
      </Paper>
    </Container>
  );
}
