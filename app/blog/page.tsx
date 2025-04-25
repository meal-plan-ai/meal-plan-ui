'use client';

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ArrowForwardIos,
  Search,
  LocalOfferOutlined,
  PersonOutline,
  CalendarTodayOutlined,
} from '@mui/icons-material';
import Header from '../../components/organisms/Header';
import Footer from '../../components/organisms/Footer';
import Link from 'next/link';

export default function BlogPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'How to Plan a Week of Healthy Meals in 30 Minutes',
      excerpt:
        'Discover our efficient method for planning a full week of nutritious meals in just half an hour, saving you time and improving your diet.',
      image: '/images/blog/meal-prep.jpg',
      category: 'Meal Planning',
      author: 'Emma Wilson',
      date: 'June 15, 2023',
      readTime: '5 min read',
      slug: 'plan-week-healthy-meals-30-minutes',
    },
    {
      id: 2,
      title: '10 Plant-Based Protein Sources You Should Include in Your Diet',
      excerpt:
        'Explore these powerful plant-based protein sources that can help you meet your nutritional needs while following a vegetarian or vegan diet.',
      image: '/images/blog/plant-protein.jpg',
      category: 'Nutrition',
      author: 'Dr. Michael Chen',
      date: 'May 28, 2023',
      readTime: '7 min read',
      slug: 'plant-based-protein-sources',
    },
    {
      id: 3,
      title: 'Budget-Friendly Meal Planning: Eat Well for Less',
      excerpt:
        'Learn how strategic meal planning can cut your grocery bill by up to 40% while still enjoying delicious, nutritious meals every day.',
      image: '/images/blog/budget-meals.jpg',
      category: 'Budgeting',
      author: 'Sarah Johnson',
      date: 'May 10, 2023',
      readTime: '6 min read',
      slug: 'budget-friendly-meal-planning',
    },
    {
      id: 4,
      title: 'The Science Behind Meal Timing: When Should You Eat?',
      excerpt:
        'Explore the research on meal timing and learn how adjusting when you eat can impact your metabolism, energy levels, and overall health.',
      image: '/images/blog/meal-timing.jpg',
      category: 'Nutrition Science',
      author: 'Dr. James Martinez',
      date: 'April 22, 2023',
      readTime: '8 min read',
      slug: 'science-behind-meal-timing',
    },
    {
      id: 5,
      title: 'Meal Prep 101: A Beginner&apos;s Guide to Efficient Cooking',
      excerpt:
        'Get started with meal prepping with our comprehensive guide covering essential techniques, time-saving tips, and beginner-friendly recipes.',
      image: '/images/blog/meal-prep-guide.jpg',
      category: 'Cooking Tips',
      author: 'Chef Anna Lopez',
      date: 'April 5, 2023',
      readTime: '10 min read',
      slug: 'meal-prep-beginners-guide',
    },
    {
      id: 6,
      title: 'Family Meal Planning: Meals That Please Everyone',
      excerpt:
        'Discover strategies for creating meal plans that satisfy different taste preferences and nutritional needs within your family.',
      image: '/images/blog/family-meals.jpg',
      category: 'Family Nutrition',
      author: 'David Williams',
      date: 'March 18, 2023',
      readTime: '6 min read',
      slug: 'family-meal-planning-guide',
    },
  ];

  // Mock categories
  const categories = [
    { name: 'Meal Planning', count: 12 },
    { name: 'Nutrition', count: 18 },
    { name: 'Recipes', count: 24 },
    { name: 'Cooking Tips', count: 9 },
    { name: 'Family Nutrition', count: 7 },
    { name: 'Budgeting', count: 5 },
    { name: 'Nutrition Science', count: 11 },
  ];

  // Mock featured posts
  const featuredPosts = blogPosts.slice(0, 2);
  const regularPosts = blogPosts.slice(2);

  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? regularPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regularPosts;

  return (
    <>
      <Header />
      <main
        className={`min-h-screen ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
            : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'
        }`}
      >
        {/* Hero Section */}
        <section className="py-16">
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              component="h1"
              className="text-4xl md:text-5xl font-bold mb-4"
              sx={{
                color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              NutriPlan Blog
            </Typography>
            <Typography
              variant="h2"
              className="text-xl md:text-2xl mb-8"
              sx={{
                color: theme === 'dark' ? 'grey.300' : 'grey.700',
                fontWeight: 400,
                maxWidth: '800px',
                mx: 'auto',
                textAlign: 'center',
              }}
            >
              Expert tips, healthy recipes, and nutrition insights to transform your meal planning
            </Typography>

            {/* Search Bar */}
            <Box sx={{ maxWidth: 600, mx: 'auto', mb: 8, mt: 6 }}>
              <TextField
                fullWidth
                placeholder="Search for articles..."
                variant="outlined"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Container>
        </section>

        {/* Featured Articles */}
        <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              className="text-3xl font-bold mb-6"
              sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
            >
              Featured Articles
            </Typography>

            <Grid container spacing={4}>
              {featuredPosts.map(post => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                      bgcolor: theme === 'dark' ? 'rgba(38, 41, 45, 0.9)' : 'white',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={post.image}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                        <Chip
                          label={post.category}
                          size="small"
                          icon={<LocalOfferOutlined />}
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: theme === 'dark' ? 'grey.400' : 'grey.600' }}
                        >
                          {post.readTime}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: theme === 'dark' ? 'white' : 'text.primary',
                          mb: 2,
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{ color: theme === 'dark' ? 'grey.300' : 'text.secondary', mb: 3 }}
                      >
                        {post.excerpt}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 'auto',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: theme === 'dark' ? 'grey.400' : 'grey.600',
                              fontSize: '0.875rem',
                              mr: 2,
                            }}
                          >
                            <PersonOutline fontSize="small" sx={{ mr: 0.5 }} />
                            {post.author}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: theme === 'dark' ? 'grey.400' : 'grey.600',
                              fontSize: '0.875rem',
                            }}
                          >
                            <CalendarTodayOutlined fontSize="small" sx={{ mr: 0.5 }} />
                            {post.date}
                          </Box>
                        </Box>
                        <Link href={`/blog/${post.slug}`} passHref>
                          <Button
                            variant="text"
                            color="primary"
                            endIcon={<ArrowForwardIos fontSize="small" />}
                            sx={{ fontWeight: 600 }}
                          >
                            Read More
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* All Articles */}
        <section className="py-16">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* Main Content */}
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h2"
                  component="h2"
                  className="text-3xl font-bold mb-6"
                  sx={{ color: theme === 'dark' ? 'primary.light' : 'primary.dark' }}
                >
                  {searchQuery ? 'Search Results' : 'Latest Articles'}
                </Typography>

                {filteredPosts.length > 0 ? (
                  <Grid container spacing={4}>
                    {filteredPosts.map(post => (
                      <Grid item xs={12} sm={6} key={post.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 2,
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 4,
                            },
                            bgcolor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="180"
                            image={post.image}
                            alt={post.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Chip
                              label={post.category}
                              size="small"
                              icon={<LocalOfferOutlined />}
                              color="primary"
                              sx={{ mb: 1.5 }}
                            />
                            <Typography
                              variant="h6"
                              component="h3"
                              gutterBottom
                              sx={{
                                fontWeight: 600,
                                color: theme === 'dark' ? 'white' : 'text.primary',
                                mb: 1.5,
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              paragraph
                              sx={{
                                color: theme === 'dark' ? 'grey.300' : 'text.secondary',
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {post.excerpt}
                            </Typography>
                            <Box
                              sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: theme === 'dark' ? 'grey.400' : 'grey.600' }}
                              >
                                {post.date} • {post.readTime}
                              </Typography>
                              <Link href={`/blog/${post.slug}`} passHref>
                                <Button
                                  variant="text"
                                  color="primary"
                                  size="small"
                                  endIcon={<ArrowForwardIos fontSize="small" />}
                                >
                                  Read
                                </Button>
                              </Link>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 2,
                      backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography variant="h6">
                      No articles found matching &quot;{searchQuery}&quot;
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </Paper>
                )}

                {/* Load More Button */}
                {filteredPosts.length > 0 && !searchQuery && (
                  <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{ px: 4, borderRadius: 2 }}
                    >
                      Load More Articles
                    </Button>
                  </Box>
                )}
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 100 }}>
                  {/* Categories Widget */}
                  <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      borderRadius: 2,
                      backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                      }}
                    >
                      Categories
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {categories.map(category => (
                        <Box
                          key={category.name}
                          component="li"
                          sx={{
                            py: 1,
                            borderBottom: `1px solid ${
                              theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }`,
                            '&:last-child': { borderBottom: 'none' },
                          }}
                        >
                          <Link
                            href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            passHref
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: theme === 'dark' ? 'grey.300' : 'text.primary',
                                '&:hover': { color: 'primary.main' },
                                textDecoration: 'none',
                              }}
                            >
                              <Typography variant="body2">{category.name}</Typography>
                              <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                ({category.count})
                              </Typography>
                            </Box>
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  {/* Newsletter Widget */}
                  <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      borderRadius: 2,
                      backgroundColor: theme === 'dark' ? 'primary.dark' : 'primary.light',
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
                      Subscribe to Our Newsletter
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Get the latest recipes, meal planning tips, and nutrition advice delivered to
                      your inbox.
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Your email address"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'rgba(255,255,255,0.7)',
                          opacity: 1,
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Paper>

                  {/* Popular Tags Widget */}
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: theme === 'dark' ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme === 'dark' ? 'primary.light' : 'primary.dark',
                      }}
                    >
                      Popular Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {[
                        'Healthy Eating',
                        'Recipes',
                        'Meal Prep',
                        'Nutrition',
                        'Vegan',
                        'Quick Meals',
                        'Protein',
                        'Breakfast',
                        'Budget',
                        'Dinner',
                      ].map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          clickable
                          sx={{
                            backgroundColor:
                              theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            color: theme === 'dark' ? 'grey.300' : 'text.primary',
                            '&:hover': {
                              backgroundColor:
                                theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Grid>
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
                Ready to Start Your Meal Planning Journey?
              </Typography>
              <Typography
                variant="subtitle1"
                className="mb-8 max-w-2xl mx-auto"
                sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
              >
                Join thousands of satisfied users and transform your eating habits with NutriPlan
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="/auth/register"
                sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 600 }}
              >
                Get Started for Free
              </Button>
            </Box>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
