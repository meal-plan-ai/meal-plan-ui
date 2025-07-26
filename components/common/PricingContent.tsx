'use client';

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  CheckCircleOutline,
  CancelOutlined,
  StarOutlined,
  PeopleOutlined,
  CalendarTodayOutlined,
  RestaurantOutlined,
  PictureAsPdfOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from '@mui/icons-material';
import Link from 'next/link';

function PricingContent() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [annually, setAnnually] = useState(false);

  const toggleBilling = () => {
    setAnnually(!annually);
  };

  const savingsPercentage = 25;
  const monthlyPremiumPrice = 9.99;
  const annuallyPremiumPrice = monthlyPremiumPrice * 12 * (1 - savingsPercentage / 100);
  const annuallyMonthlyPrice = annuallyPremiumPrice / 12;

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const plans = [
    {
      name: 'Free',
      description: 'Basic meal planning for individuals',
      price: 0,
      featured: false,
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
        {
          text: 'Basic PDF export',
          included: true,
          icon: <PictureAsPdfOutlined />,
        },
        {
          text: 'Multiple meal plan templates',
          included: false,
          icon: <RestaurantOutlined />,
        },
        {
          text: 'Meal plan customization',
          included: false,
          icon: <RestaurantOutlined />,
        },
        {
          text: 'Family meal planning',
          included: false,
          icon: <PeopleOutlined />,
        },
      ],
      ctaText: 'Start Free',
      ctaLink: '/auth/register',
    },
    {
      name: 'Premium',
      description: 'Advanced meal planning for individuals and families',
      price: annually ? annuallyMonthlyPrice : monthlyPremiumPrice,
      billingPeriod: annually ? 'monthly, billed annually' : 'monthly',
      featured: true,
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
          text: 'Full recipe database access',
          included: true,
          icon: <RestaurantOutlined />,
        },
        {
          text: 'Beautiful PDF cookbook with photos',
          included: true,
          icon: <PictureAsPdfOutlined />,
        },
        {
          text: 'Multiple meal plan templates',
          included: true,
          icon: <RestaurantOutlined />,
        },
        {
          text: 'Full meal plan customization',
          included: true,
          icon: <RestaurantOutlined />,
        },
        {
          text: 'Priority customer support',
          included: true,
          icon: <StarOutlined />,
        },
      ],
      ctaText: annually ? 'Get Premium Annually' : 'Get Premium Monthly',
      ctaLink: '/payment',
    },
  ];

  return (
    <main
      className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'}`}
    >
      {/* Hero Section */}
      <section className="py-16">
        <Container maxWidth="lg">
          {pathname !== '/subscription' && (
            <Box className="text-center mb-12">
              <Typography
                variant="h1"
                component="h1"
                className="text-4xl md:text-5xl font-bold mb-4"
                sx={{
                  color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                  fontWeight: 800,
                }}
              >
                Choose Your Perfect Plan
              </Typography>
              <Typography
                variant="h2"
                className="text-xl md:text-2xl mb-8"
                sx={{
                  color: theme === 'dark' ? 'grey.300' : 'grey.700',
                  fontWeight: 400,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Whether you are just starting or need advanced meal planning for your entire family,
                we have the perfect plan for you
              </Typography>
            </Box>
          )}

          {/* Billing Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, mt: 8 }}>
            <FormControlLabel
              control={<Switch checked={annually} onChange={toggleBilling} color="primary" />}
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
                Monthly Billing
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
                Annual Billing
              </Typography>
              <Chip
                label={`Save ${savingsPercentage}%`}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>

          {/* Pricing Cards */}
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={plan.featured ? 6 : 1}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    border: plan.featured
                      ? `2px solid ${theme === 'dark' ? 'primary.light' : 'primary.main'}`
                      : 'none',
                    backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: plan.featured ? 'scale(1.04)' : 'scale(1.02)',
                    },
                  }}
                >
                  {plan.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: -30,
                        transform: 'rotate(45deg)',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        px: 4,
                        width: 150,
                      }}
                    >
                      <Typography variant="body2" align="center" fontWeight="bold">
                        MOST POPULAR
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme === 'dark' ? 'grey.300' : 'grey.700',
                      mb: 3,
                    }}
                  >
                    {plan.description}
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Typography
                        variant="h3"
                        component="span"
                        sx={{
                          fontWeight: 800,
                          color: theme === 'dark' ? 'white' : 'text.primary',
                        }}
                      >
                        ${plan.price === 0 ? '0' : formatPrice(plan.price)}
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
                          /{plan.billingPeriod}
                        </Typography>
                      )}
                    </Box>
                    {annually && plan.price > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme === 'dark' ? 'success.light' : 'success.main',
                          mt: 1,
                        }}
                      >
                        ${formatPrice(annuallyPremiumPrice)} billed annually
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            ml: 1,
                            color: theme === 'dark' ? 'primary.light' : 'primary.main',
                            fontWeight: 'bold',
                          }}
                        >
                          (Save ${formatPrice(monthlyPremiumPrice * 12 - annuallyPremiumPrice)})
                        </Typography>
                      </Typography>
                    )}
                  </Box>

                  <List sx={{ mb: 4 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {feature.included ? (
                            <CheckCircleOutline color="primary" />
                          ) : (
                            <CancelOutlined color="disabled" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  mr: 1,
                                  color: theme === 'dark' ? 'primary.light' : 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {feature.icon}
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: feature.included
                                    ? theme === 'dark'
                                      ? 'grey.300'
                                      : 'text.primary'
                                    : theme === 'dark'
                                      ? 'grey.600'
                                      : 'grey.500',
                                  fontWeight: feature.included ? 500 : 400,
                                }}
                              >
                                {feature.text}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Link href={plan.ctaLink} passHref>
                    <Button
                      variant={plan.featured ? 'contained' : 'outlined'}
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Features Comparison */}
          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <Container maxWidth="lg">
              <Typography
                variant="h2"
                component="h2"
                align="center"
                className="text-3xl font-bold mb-3"
                sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
              >
                Detailed Plan Comparison
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                className="mb-12 max-w-2xl mx-auto"
                sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
              >
                See exactly what is included in each plan
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 600, maxWidth: 900, mx: 'auto' }}>
                  <Grid
                    container
                    sx={{
                      borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      pb: 2,
                      mb: 2,
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" fontWeight="bold">
                        Features
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" fontWeight="bold" align="center">
                        Free
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" fontWeight="bold" align="center" color="primary">
                        Premium
                      </Typography>
                    </Grid>
                  </Grid>

                  {[
                    {
                      category: 'Plan Duration',
                      free: '1-day plans only',
                      premium: 'Up to 7-day plans',
                      icon: <CalendarTodayOutlined />,
                    },
                    {
                      category: 'Servings',
                      free: 'Single person only',
                      premium: 'Up to 6 people',
                      icon: <PeopleOutlined />,
                    },
                    {
                      category: 'Monthly Plans',
                      free: '2 plans',
                      premium: 'Unlimited',
                      icon: <RestaurantOutlined />,
                    },
                    {
                      category: 'Recipe Selection',
                      free: 'Limited (50+ recipes)',
                      premium: 'Full access (1000+ recipes)',
                      icon: <RestaurantOutlined />,
                    },
                    {
                      category: 'Shopping List',
                      free: 'Basic text format',
                      premium: 'Organized by grocery sections',
                      icon: <ShoppingCartOutlined />,
                    },
                    {
                      category: 'PDF Export',
                      free: 'Basic PDF',
                      premium: 'Beautiful cookbook with photos',
                      icon: <PictureAsPdfOutlined />,
                    },
                    {
                      category: 'Special Diets',
                      free: 'Basic options only',
                      premium: 'All diet types supported',
                      icon: <TagOutlined />,
                    },
                    {
                      category: 'Nutritional Analysis',
                      free: 'Basic',
                      premium: 'Detailed breakdown',
                      icon: <RestaurantOutlined />,
                    },
                    {
                      category: 'Customer Support',
                      free: 'Email support',
                      premium: 'Priority support',
                      icon: <StarOutlined />,
                    },
                  ].map((row, index) => (
                    <Grid
                      container
                      key={index}
                      sx={{
                        py: 2,
                        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        bgcolor:
                          index % 2 === 0
                            ? 'transparent'
                            : theme === 'dark'
                              ? 'rgba(255,255,255,0.03)'
                              : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            mr: 1,
                            color: theme === 'dark' ? 'primary.light' : 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {row.icon}
                        </Box>
                        <Typography variant="body1" fontWeight={500}>
                          {row.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" align="center">
                          {row.free}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" align="center" fontWeight={500}>
                          {row.premium}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Container>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <Container maxWidth="lg">
              <Typography
                variant="h2"
                component="h2"
                align="center"
                className="text-3xl font-bold mb-3"
                sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
              >
                Frequently Asked Questions
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                className="mb-12 max-w-2xl mx-auto"
                sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
              >
                Common questions about our pricing plans
              </Typography>

              <Grid container spacing={4}>
                {[
                  {
                    question: 'Can I switch between plans?',
                    answer:
                      'Yes, you can upgrade from Free to Premium at any time. You can also switch between monthly and annual billing cycles when renewing your subscription.',
                  },
                  {
                    question: 'Is there a free trial for Premium?',
                    answer:
                      'Yes, we offer a 7-day free trial for our Premium plan. You can experience all Premium features before deciding to subscribe.',
                  },
                  {
                    question: 'Can I cancel my subscription anytime?',
                    answer:
                      "Absolutely. You can cancel your subscription at any time. For monthly plans, you'll have access until the end of your billing cycle. For annual plans, you'll have access until the end of the 12-month period.",
                  },
                  {
                    question: 'What payment methods do you accept?',
                    answer:
                      'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay.',
                  },
                  {
                    question: 'Is my payment information secure?',
                    answer:
                      'Yes, we use industry-standard encryption and security practices. We never store your credit card information on our servers.',
                  },
                  {
                    question: 'Do you offer refunds?',
                    answer:
                      "If you're unsatisfied with our service, you can request a refund within 14 days of purchase for monthly plans and 30 days for annual plans.",
                  },
                ].map((faq, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: '100%',
                        backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                        }}
                      >
                        {faq.question}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme === 'dark' ? 'grey.300' : 'text.secondary',
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </section>

          {/* CTA Section */}
          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <Container maxWidth="md">
              <Box className="text-center p-8 rounded-xl">
                <Typography
                  variant="h3"
                  component="h2"
                  className="text-2xl md:text-3xl font-bold mb-4"
                  sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
                >
                  Ready to Transform Your Meal Planning?
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="mb-8 max-w-2xl mx-auto"
                  sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
                >
                  Start with our Free plan today or try Premium with a 7-day free trial
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Link href="/auth/register" passHref>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{ py: 1.5, px: 3, borderRadius: 1.5, fontWeight: 600 }}
                    >
                      Start Free
                    </Button>
                  </Link>
                  <Link href="/payment" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ py: 1.5, px: 3, borderRadius: 1.5, fontWeight: 600 }}
                    >
                      Try Premium Free
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Container>
          </section>
        </Container>
      </section>
    </main>
  );
}

export { PricingContent };
