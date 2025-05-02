'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel as MuiFormControlLabel,
} from '@mui/material';
import {
  CalendarTodayOutlined,
  PeopleOutlined,
  RestaurantOutlined,
  ShoppingCartOutlined,
  StarOutlined,
} from '@mui/icons-material';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annually';
  description: string;
  features: {
    text: string;
    included: boolean;
    icon: React.ReactNode;
  }[];
}

interface PlanSelectionProps {
  selectedPlan: {
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'annually';
    description: string;
  } | null;
  onSelectPlan: (
    plan: {
      id: string;
      name: string;
      price: number;
      interval: 'monthly' | 'annually';
      description: string;
    } | null
  ) => void;
}

function PlanSelection({ selectedPlan, onSelectPlan }: PlanSelectionProps) {
  const { theme } = useTheme();
  const [annually, setAnnually] = useState(false);

  const savingsPercentage = 25;
  const monthlyPremiumPrice = 9.99;
  const annuallyPremiumPrice = monthlyPremiumPrice * 12 * (1 - savingsPercentage / 100);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const plans: Plan[] = useMemo(
    () => [
      {
        id: '0',
        name: 'Free',
        description: 'Basic meal planning for individuals',
        price: 0,
        interval: 'monthly',
        features: [
          {
            text: '1-day meal plans only',
            included: true,
            icon: <CalendarTodayOutlined />,
          },
          {
            text: 'For single person only',
            included: true,
            icon: <PeopleOutlined />,
          },
          {
            text: 'Generate up to 2 meal plans per month',
            included: true,
            icon: <RestaurantOutlined />,
          },
          {
            text: 'Basic shopping list (TXT format)',
            included: true,
            icon: <ShoppingCartOutlined />,
          },
          {
            text: 'Limited recipe selection',
            included: true,
            icon: <RestaurantOutlined />,
          },
        ],
      },
      {
        id: '1',
        name: 'Premium Monthly',
        description: 'Advanced meal planning for individuals and families',
        price: monthlyPremiumPrice,
        interval: 'monthly',
        features: [
          {
            text: 'Up to 7-day meal plans',
            included: true,
            icon: <CalendarTodayOutlined />,
          },
          {
            text: 'Family meal planning (up to 6 people)',
            included: true,
            icon: <PeopleOutlined />,
          },
          {
            text: 'Unlimited meal plans',
            included: true,
            icon: <RestaurantOutlined />,
          },
          {
            text: 'Organized shopping list by grocery sections',
            included: true,
            icon: <ShoppingCartOutlined />,
          },
          {
            text: 'Priority customer support',
            included: true,
            icon: <StarOutlined />,
          },
        ],
      },
      {
        id: 'premium-annually',
        name: 'Premium Annually',
        description: 'Save 25% with annual billing',
        price: annuallyPremiumPrice,
        interval: 'annually',
        features: [
          {
            text: 'Up to 7-day meal plans',
            included: true,
            icon: <CalendarTodayOutlined />,
          },
          {
            text: 'Family meal planning (up to 6 people)',
            included: true,
            icon: <PeopleOutlined />,
          },
          {
            text: 'Unlimited meal plans',
            included: true,
            icon: <RestaurantOutlined />,
          },
          {
            text: 'Organized shopping list by grocery sections',
            included: true,
            icon: <ShoppingCartOutlined />,
          },
          {
            text: 'Priority customer support',
            included: true,
            icon: <StarOutlined />,
          },
        ],
      },
    ],
    [annuallyPremiumPrice, monthlyPremiumPrice]
  );

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      onSelectPlan({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        description: plan.description,
      });
    }
  };

  useEffect(() => {
    // If switched to annual plan and a monthly plan is selected - switch to annual
    if (annually && selectedPlan?.interval === 'monthly' && selectedPlan?.id !== 'free') {
      const annualPlan = plans.find(p => p.id === 'premium-annually');
      if (annualPlan) {
        onSelectPlan({
          id: annualPlan.id,
          name: annualPlan.name,
          price: annualPlan.price,
          interval: annualPlan.interval,
          description: annualPlan.description,
        });
      }
    }
    // If switched to monthly plan and an annual plan is selected - switch to monthly
    else if (!annually && selectedPlan?.interval === 'annually') {
      const monthlyPlan = plans.find(p => p.id === '1');
      if (monthlyPlan) {
        onSelectPlan({
          id: monthlyPlan.id,
          name: monthlyPlan.name,
          price: monthlyPlan.price,
          interval: monthlyPlan.interval,
          description: monthlyPlan.description,
        });
      }
    }
  }, [annually, selectedPlan, onSelectPlan, plans]);

  useEffect(() => {
    onSelectPlan(plans.find(p => p.id === 'free') || null);
  }, [onSelectPlan, plans]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Choose a suitable plan
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <MuiFormControlLabel
          control={
            <Switch checked={annually} onChange={() => setAnnually(!annually)} color="primary" />
          }
          label=""
          sx={{ mr: 0 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: annually ? 400 : 600,
              color: annually
                ? theme === 'dark'
                  ? 'grey.400'
                  : 'grey.600'
                : theme === 'dark'
                  ? 'white'
                  : 'text.primary',
              mr: 1,
            }}
          >
            Monthly
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: annually ? 600 : 400,
              color: annually
                ? theme === 'dark'
                  ? 'white'
                  : 'text.primary'
                : theme === 'dark'
                  ? 'grey.400'
                  : 'grey.600',
              ml: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Annually
            <Chip
              label={`Save ${savingsPercentage}%`}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>
      </Box>

      <RadioGroup
        value={selectedPlan?.id || ''}
        onChange={e => handlePlanChange(e.target.value)}
        sx={{ width: '100%' }}
      >
        <Grid container spacing={3}>
          {plans
            .filter(
              plan =>
                plan.id === 'free' ||
                (annually && plan.interval === 'annually') ||
                (!annually && plan.interval === 'monthly')
            )
            .map(plan => (
              <Grid item xs={12} md={6} key={plan.id}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    border: selectedPlan?.id === plan.id ? '2px solid' : '1px solid',
                    borderColor: selectedPlan?.id === plan.id ? 'primary.main' : 'divider',
                    backgroundColor:
                      theme === 'dark'
                        ? selectedPlan?.id === plan.id
                          ? 'rgba(25, 118, 210, 0.08)'
                          : 'rgba(38, 50, 56, 0.6)'
                        : selectedPlan?.id === plan.id
                          ? 'rgba(25, 118, 210, 0.04)'
                          : 'white',
                  }}
                >
                  {selectedPlan?.id === plan.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        px: 1.5,
                        borderBottomLeftRadius: 8,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      Selected
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <FormControlLabel
                      value={plan.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              fontWeight: 600,
                              color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                            }}
                          >
                            {plan.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme === 'dark' ? 'grey.300' : 'grey.700',
                              mb: 2,
                            }}
                          >
                            {plan.description}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        alignItems: 'flex-start',
                        m: 0,
                        width: '100%',
                        '& .MuiFormControlLabel-label': {
                          width: '100%',
                        },
                      }}
                    />

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Typography
                          variant="h4"
                          component="span"
                          sx={{
                            fontWeight: 700,
                            color: theme === 'dark' ? 'white' : 'text.primary',
                          }}
                        >
                          $
                          {formatPrice(
                            plan.price === 0
                              ? 0
                              : plan.interval === 'monthly'
                                ? plan.price
                                : plan.price / 12
                          )}
                        </Typography>
                        {plan.price > 0 && (
                          <Typography
                            variant="h6"
                            component="span"
                            sx={{
                              ml: 1,
                              mb: 0.5,
                              color: theme === 'dark' ? 'grey.400' : 'grey.600',
                            }}
                          >
                            /month
                          </Typography>
                        )}
                      </Box>

                      {plan.interval === 'annually' && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme === 'dark' ? 'success.light' : 'success.main',
                            mt: 1,
                          }}
                        >
                          ${formatPrice(plan.price)} per year
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              ml: 1,
                              color: theme === 'dark' ? 'primary.light' : 'primary.main',
                              fontWeight: 'bold',
                            }}
                          >
                            (Save ${formatPrice(monthlyPremiumPrice * 12 - plan.price)})
                          </Typography>
                        </Typography>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List disablePadding>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                            {feature.icon}
                          </ListItemIcon>
                          <ListItemText primary={feature.text} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
}

export { PlanSelection };
