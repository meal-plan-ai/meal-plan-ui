'use client';

import { useTheme } from '../contexts/ThemeContext';
import Link from 'next/link';
import { Button, Container, Typography, Box, Grid, Chip, Rating } from '@mui/material';
import {
  KeyboardArrowRightRounded,
  CheckCircleRounded,
  AccessTimeRounded,
  RestaurantRounded,
  DescriptionRounded,
  ShoppingBasketRounded,
  EmojiEventsOutlined,
  PersonOutlined,
  RestaurantMenuOutlined,
  PublicOutlined,
  StarOutlined,
  MonetizationOnOutlined,
  ShoppingCartOutlined,
  SmartToyOutlined,
} from '@mui/icons-material';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import AwardBadge from '../components/molecules/AwardBadge';
import StatsCounter from '../components/atoms/StatsCounter';
import FeatureCard from '../components/molecules/FeatureCard';
import TestimonialCard from '../components/molecules/TestimonialCard';
import StepCard from '../components/atoms/StepCard';

export default function LandingPage() {
  const { theme } = useTheme();

  const features = [
    {
      icon: <RestaurantRounded fontSize="large" />,
      title: 'Personalized Meal Plans',
      description: 'Tailored to your dietary needs, preferences, and health goals',
      bgColor: theme === 'dark' ? 'rgba(66, 99, 235, 0.2)' : 'rgba(66, 99, 235, 0.1)',
    },
    {
      icon: <ShoppingBasketRounded fontSize="large" />,
      title: 'Smart Shopping Lists',
      description: 'Automatically generated lists of ingredients for your weekly meals',
      bgColor: theme === 'dark' ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)',
    },
    {
      icon: <DescriptionRounded fontSize="large" />,
      title: 'Detailed Recipes',
      description: 'Step-by-step instructions and nutritional information for each meal',
      bgColor: theme === 'dark' ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)',
    },
    {
      icon: <AccessTimeRounded fontSize="large" />,
      title: 'Quick Setup',
      description: 'Create your personalized meal plan in under 5 minutes',
      bgColor: theme === 'dark' ? 'rgba(251, 188, 5, 0.2)' : 'rgba(251, 188, 5, 0.1)',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: '/avatars/avatar1.jpg',
      role: 'Fitness Coach',
      review:
        'NutriPlan has revolutionized how I create meal plans for my clients. The AI recommendations are spot-on!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      avatar: '/avatars/avatar2.jpg',
      role: 'Working Professional',
      review:
        "I've saved so much time and improved my nutrition. The shopping lists make grocery shopping effortless.",
      rating: 5,
    },
    {
      name: 'Emma Garcia',
      avatar: '/avatars/avatar3.jpg',
      role: 'Busy Parent',
      review:
        'As a mom of three, NutriPlan has been a lifesaver. Healthy meals my kids actually enjoy!',
      rating: 4.5,
    },
  ];

  const awards = [
    {
      icon: <EmojiEventsOutlined style={{ color: '#4CAF50' }} />,
      title: 'Best Nutrition App of 2023',
      organization: 'Health Tech Awards',
      year: '2023',
      accentColor: 'rgba(76, 175, 80, 0.2)',
    },
    {
      icon: <EmojiEventsOutlined style={{ color: '#2196F3' }} />,
      title: 'Top 10 AI Startups',
      organization: 'TechCrunch',
      year: '2023',
      accentColor: 'rgba(33, 150, 243, 0.2)',
    },
    {
      icon: <EmojiEventsOutlined style={{ color: '#F44336' }} />,
      title: 'Excellence in User Experience',
      organization: 'Product Hunt',
      year: '2023',
      accentColor: 'rgba(244, 67, 54, 0.2)',
    },
  ];

  const stats = [
    {
      icon: <PersonOutlined fontSize="large" />,
      value: '2M+',
      label: 'Active Users',
      iconColor: '#4263EB',
    },
    {
      icon: <RestaurantMenuOutlined fontSize="large" />,
      value: '50M+',
      label: 'Meals Generated',
      iconColor: '#4CAF50',
    },
    {
      icon: <PublicOutlined fontSize="large" />,
      value: '120+',
      label: 'Countries',
      iconColor: '#2196F3',
    },
    {
      icon: <StarOutlined fontSize="large" />,
      value: '4.9',
      label: 'App Store Rating',
      iconColor: '#FFC107',
    },
  ];

  const valueProps = [
    {
      icon: <SmartToyOutlined fontSize="large" />,
      title: 'AI-Powered Meal Plans',
      description:
        'Get personalized meal plans based on your dietary preferences, restrictions, and health goals.',
      bgColor: theme === 'dark' ? 'rgba(66, 99, 235, 0.2)' : 'rgba(66, 99, 235, 0.1)',
    },
    {
      icon: <AccessTimeRounded fontSize="large" />,
      title: 'Time Saving',
      description: 'Save 5+ hours weekly on meal planning, recipe searching, and grocery shopping.',
      bgColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
    },
    {
      icon: <MonetizationOnOutlined fontSize="large" />,
      title: 'Reduced Food Waste',
      description:
        'Smart ingredient recommendations help reduce waste by 40% and save money on groceries.',
      bgColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)',
    },
    {
      icon: <ShoppingCartOutlined fontSize="large" />,
      title: 'Smart Shopping Lists',
      description: 'Automatically generated shopping lists organized by grocery store sections.',
      bgColor: theme === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
    },
  ];

  return (
    <>
      <Header />
      <main
        className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'}`}
      >
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h1"
                  component="h1"
                  className="text-4xl md:text-5xl font-bold mb-4"
                  sx={{
                    color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                    fontWeight: 800,
                  }}
                >
                  Your Personal AI Nutrition Assistant
                </Typography>
                <Typography
                  variant="h2"
                  className="text-xl md:text-2xl mb-6"
                  sx={{
                    color: theme === 'dark' ? 'grey.300' : 'grey.700',
                    fontWeight: 400,
                  }}
                >
                  Create personalized meal plans tailored to your preferences, dietary needs, and
                  health goals
                </Typography>
                <Box className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/auth/register" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<KeyboardArrowRightRounded />}
                      className="py-3 px-6 text-base font-medium"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/how-it-works" passHref>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      className="py-3 px-6 text-base font-medium"
                    >
                      How It Works
                    </Button>
                  </Link>
                </Box>
                <Box className="flex items-center gap-2">
                  <Rating value={4.8} precision={0.1} readOnly />
                  <Typography variant="body2" className="font-medium">
                    4.8/5 from 2,000+ reviews
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  className="relative rounded-xl overflow-hidden shadow-lg"
                  sx={{ aspectRatio: '4/3' }}
                >
                  <img
                    src="/images/hero-meal-plan.jpg"
                    alt="NutriPlan AI meal planning app showcase"
                    className="w-full h-full object-cover"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </section>

        {/* Awards Section */}
        <section className={`py-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 4,
                color: theme === 'dark' ? 'grey.200' : 'grey.800',
              }}
            >
              Award-Winning AI Nutrition Platform
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {awards.map((award, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <AwardBadge
                    icon={award.icon}
                    title={award.title}
                    organization={award.organization}
                    year={award.year}
                    accentColor={award.accentColor}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <StatsCounter
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    iconColor={stat.iconColor}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Why Millions Love Section */}
        <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              align="center"
              className="text-3xl md:text-4xl font-bold mb-3"
              sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
            >
              Why Millions Love NutriPlan AI
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              className="mb-12 max-w-2xl mx-auto"
              sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
            >
              Our AI-powered platform makes healthy eating accessible, affordable, and stress-free.
            </Typography>

            <Grid container spacing={4}>
              {valueProps.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    bgColor={feature.bgColor}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              align="center"
              className="text-3xl font-bold mb-3"
              sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
            >
              How NutriPlan Works
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              className="mb-12 max-w-2xl mx-auto"
              sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
            >
              Create your perfect meal plan in three simple steps
            </Typography>

            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <StepCard
                  number={1}
                  title="Set Your Preferences"
                  description="Tell us about your dietary needs, health goals, and food preferences"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StepCard
                  number={2}
                  title="AI Creates Your Plan"
                  description="Our AI analyzes thousands of recipes to build your perfect 1-7 day meal plan"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StepCard
                  number={3}
                  title="Get Everything You Need"
                  description="Download your meal plan, shopping list, and detailed recipes as PDF"
                />
              </Grid>
            </Grid>
          </Container>
        </section>

        {/* Features Section */}
        <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              align="center"
              className="text-3xl font-bold mb-3"
              sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              className="mb-12 max-w-2xl mx-auto"
              sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
            >
              Everything you need for successful meal planning
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    bgColor={feature.bgColor}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              align="center"
              className="text-3xl font-bold mb-3"
              sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              className="mb-12 max-w-2xl mx-auto"
              sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
            >
              Join thousands of satisfied users who have transformed their nutrition
            </Typography>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TestimonialCard
                    name={testimonial.name}
                    avatar={testimonial.avatar}
                    role={testimonial.role}
                    review={testimonial.review}
                    rating={testimonial.rating}
                  />
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
                Start Your Personalized Nutrition Journey Today
              </Typography>
              <Typography
                variant="subtitle1"
                className="mb-8 max-w-2xl mx-auto"
                sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
              >
                Join thousands of satisfied users who have transformed their eating habits with
                NutriPlan
              </Typography>
              <Link href="/auth/register" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<KeyboardArrowRightRounded />}
                  className="py-3 px-8 text-base font-medium"
                >
                  Create Free Account
                </Button>
              </Link>
              <Box className="mt-6 flex flex-wrap justify-center gap-2">
                {['No Credit Card Required', '7-Day Free Trial', 'Cancel Anytime'].map(
                  (item, i) => (
                    <Chip
                      key={i}
                      icon={<CheckCircleRounded />}
                      label={item}
                      variant="outlined"
                      sx={{
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )
                )}
              </Box>
            </Box>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
