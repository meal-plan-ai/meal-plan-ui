import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PlayArrowRounded,
  PersonOutlined,
  SettingsOutlined,
  ReceiptLongOutlined,
  LocalGroceryStoreOutlined,
  MobileFriendlyOutlined,
  FormatListBulletedOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useTheme } from '@/contexts';
import Image from 'next/image';

const detailedSteps = [
  {
    number: 1,
    title: 'Create Your Profile',
    description: 'Set your dietary preferences, restrictions, and nutritional goals',
    details: [
      'Select dietary preferences (vegetarian, vegan, paleo, etc.)',
      'Mark any food allergies or ingredients to avoid',
      'Set calorie and macronutrient targets',
      'Specify your cooking skill level and time constraints',
    ],
  },
  {
    number: 2,
    title: 'Generate Your Meal Plan',
    description: 'Our AI analyzes thousands of recipes to build your perfect meal plan',
    details: [
      'Choose the number of days for your meal plan (1-7)',
      'Select which meals to include (breakfast, lunch, dinner, snacks)',
      'Specify portion sizes and servings',
      'Adjust recipe complexity and cooking time preferences',
    ],
  },
  {
    number: 3,
    title: 'Customize Your Plan',
    description: 'Fine-tune your meal plan until it perfectly matches your preferences',
    details: [
      "Swap out any meals you don't like",
      'Adjust serving sizes and portions',
      'Regenerate specific days if needed',
      'Save favorite meals for future meal plans',
    ],
  },
  {
    number: 4,
    title: 'Shop With Ease',
    description: 'Use the auto-generated shopping list organized by grocery store sections',
    details: [
      'View all ingredients needed for your meal plan',
      'Ingredients organized by grocery department',
      'Check off items as you shop',
      'Save lists for recurring use',
    ],
  },
  {
    number: 5,
    title: 'Cook and Enjoy',
    description: 'Follow detailed recipes with nutritional information for each meal',
    details: [
      'Step-by-step cooking instructions',
      'Meal prep suggestions and time-saving tips',
      'Track your nutrition as you follow your plan',
      'Rate meals and provide feedback to improve future recommendations',
    ],
  },
];

const keyFeatures = [
  {
    icon: <PersonOutlined fontSize="large" />,
    title: 'Personalized Recommendations',
    description:
      'Our AI learns your preferences over time and makes increasingly personalized recommendations',
  },
  {
    icon: <SettingsOutlined fontSize="large" />,
    title: 'Flexible Customization',
    description:
      'Easily adjust your meal plan to fit your schedule, budget, and available ingredients',
  },
  {
    icon: <ReceiptLongOutlined fontSize="large" />,
    title: 'Detailed Nutrition Info',
    description:
      'View complete macronutrient and calorie information for every meal and daily totals',
  },
  {
    icon: <LocalGroceryStoreOutlined fontSize="large" />,
    title: 'Smart Shopping Lists',
    description:
      'Shopping lists organized by grocery store section to save time and reduce store wandering',
  },
  {
    icon: <MobileFriendlyOutlined fontSize="large" />,
    title: 'Mobile-Friendly Design',
    description: 'Access your meal plans, shopping lists, and recipes from any device',
  },
  {
    icon: <FormatListBulletedOutlined fontSize="large" />,
    title: 'Recipe Collections',
    description: 'Save your favorite recipes and create custom collections for different occasions',
  },
];

const faqItems = [
  {
    question: 'How much does NutriPlan cost?',
    answer:
      'NutriPlan offers a free 7-day trial, after which plans start at $9.99/month. Visit our pricing page for more details on our different plans and features.',
  },
  {
    question: "Can I customize my meal plan after it's generated?",
    answer:
      'Yes! You can swap out any meals, adjust serving sizes, regenerate specific days, and save favorite recipes for future use. Our platform is designed to be fully flexible.',
  },
  {
    question: 'Does NutriPlan support specific diets?',
    answer:
      'Absolutely. NutriPlan supports a wide range of dietary needs including keto, paleo, vegetarian, vegan, gluten-free, dairy-free, and many more specific dietary requirements.',
  },
  {
    question: 'Can I export my meal plan and shopping list?',
    answer:
      'Yes, you can export your meal plans and shopping lists as PDF files for easy printing or sharing. You can also access everything from our mobile app.',
  },
  {
    question: 'How often can I generate new meal plans?',
    answer:
      'On our standard plans, you can generate up to 4 meal plans per month. Premium subscribers enjoy unlimited meal plan generation.',
  },
];

function HowItWorksContent() {
  const { theme } = useTheme();

  return (
    <main
      className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'}`}
    >
      {/* Hero Section */}
      <section className="py-16">
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
                How NutriPlan Works
              </Typography>
              <Typography
                variant="h2"
                className="text-xl md:text-2xl mb-6"
                sx={{
                  color: theme === 'dark' ? 'grey.300' : 'grey.700',
                  fontWeight: 400,
                }}
              >
                Discover how our AI-powered platform makes meal planning simple, personalized, and
                effective
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                className="relative rounded-xl overflow-hidden shadow-lg"
                sx={{ aspectRatio: '4/3' }}
              >
                <Image
                  src="/images/how-it-works-hero.jpg"
                  alt="NutriPlan meal planning process"
                  fill
                  className="object-cover"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Detailed Steps */}
      <section className="py-16">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            className="text-3xl font-bold mb-3"
            sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
          >
            Detailed Process Breakdown
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            className="mb-12 max-w-2xl mx-auto"
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            A closer look at each step of the NutriPlan experience
          </Typography>

          {detailedSteps.map((step, index) => (
            <Paper
              key={step.number}
              elevation={1}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 2,
                backgroundColor:
                  theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Grid
                container
                spacing={4}
                alignItems="center"
                direction={index % 2 ? 'row-reverse' : 'row'}
              >
                <Grid item xs={12} md={4}>
                  <Box
                    className="relative rounded-xl overflow-hidden shadow-md"
                    sx={{ aspectRatio: '1/1' }}
                  >
                    <Image
                      src={`/images/step-${step.number}.jpg`}
                      alt={`Step ${step.number}: ${step.title}`}
                      fill
                      className="object-cover"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 2,
                      }}
                    >
                      {step.number}
                    </Box>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: theme === 'dark' ? 'grey.300' : 'grey.700',
                    }}
                  >
                    {step.description}
                  </Typography>
                  <List>
                    {step.details.map((detail, i) => (
                      <ListItem key={i} sx={{ p: 0, mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutline color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={detail}
                          primaryTypographyProps={{
                            color: theme === 'dark' ? 'grey.300' : 'text.primary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Container>
      </section>

      {/* Key Features */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            className="text-3xl font-bold mb-3"
            sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
          >
            Key Features That Make NutriPlan Unique
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            className="mb-12 max-w-2xl mx-auto"
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            Advanced tools and features designed to make healthy eating simple and enjoyable
          </Typography>

          <Grid container spacing={4}>
            {keyFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    borderRadius: 2,
                    backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      mb: 2,
                      color: 'primary.main',
                      backgroundColor:
                        theme === 'dark' ? 'rgba(66, 99, 235, 0.2)' : 'rgba(66, 99, 235, 0.1)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme === 'dark' ? 'grey.300' : 'text.secondary',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
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
            Common questions about using NutriPlan
          </Typography>

          <Grid container spacing={4}>
            {faqItems.map((faq, index) => (
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

      {/* Video Demo Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            className="text-3xl font-bold mb-3"
            sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
          >
            See NutriPlan in Action
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            className="mb-8 max-w-2xl mx-auto"
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            Watch a quick demo of how to create your first meal plan
          </Typography>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 800,
              mx: 'auto',
              height: 0,
              paddingTop: '56.25%', // 16:9 aspect ratio
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/images/video-thumbnail.jpg"
                alt="NutriPlan video tutorial"
                fill
                style={{ objectFit: 'cover', opacity: 0.7 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <PlayArrowRounded sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </section>
    </main>
  );
}

export { HowItWorksContent };
