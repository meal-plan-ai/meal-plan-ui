'use client';

import Link from 'next/link';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchParams } from 'next/navigation';
import blogPostsData from '@/data/blogPosts.json';
import categoriesData from '@/data/blogCategories.json';

// Define a type for the blog post
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
  content: string;
}

// Define a type for categories
interface BlogCategory {
  name: string;
  count: number;
}

// Data fetching function
function getBlogData() {
  // In a real app, this would fetch from an API or database
  // For now, we're using the static JSON data
  const featured = blogPostsData.slice(0, 2) as BlogPost[];
  const regular = blogPostsData.slice(2) as BlogPost[];

  return {
    featuredPosts: featured,
    regularPosts: regular,
    categories: categoriesData as BlogCategory[],
  };
}

export default function BlogPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('query') || '';
  const isDarkTheme = theme === 'dark';

  const { featuredPosts, regularPosts, categories } = getBlogData();

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
      <main
        className={`min-h-screen ${
          isDarkTheme
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
                color: isDarkTheme ? 'primary.light' : 'primary.dark',
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
                color: isDarkTheme ? 'grey.300' : 'grey.700',
                fontWeight: 400,
                maxWidth: '800px',
                mx: 'auto',
                textAlign: 'center',
              }}
            >
              Expert tips, healthy recipes, and nutrition insights to transform your meal planning
            </Typography>

            {/* Search Form */}
            <Box
              component="form"
              action="/blog"
              method="get"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                mb: 8,
                mt: 6,
                display: 'flex',
              }}
            >
              <TextField
                fullWidth
                name="query"
                placeholder="Search for articles..."
                variant="outlined"
                defaultValue={searchQuery}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                Search
              </Button>
            </Box>
          </Container>
        </section>

        {/* Featured Articles */}
        <section className={`py-12 ${isDarkTheme ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              className="text-3xl font-bold mb-6"
              sx={{ color: isDarkTheme ? 'primary.light' : 'primary.dark' }}
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
                      bgcolor: isDarkTheme ? 'rgba(38, 41, 45, 0.9)' : 'white',
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
                          sx={{ color: isDarkTheme ? 'grey.400' : 'grey.600' }}
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
                          color: isDarkTheme ? 'white' : 'text.primary',
                          mb: 2,
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{ color: isDarkTheme ? 'grey.300' : 'text.secondary', mb: 3 }}
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
                              color: 'grey.600',
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
                              color: 'grey.600',
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
                  sx={{ color: isDarkTheme ? 'primary.light' : 'primary.dark' }}
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
                            bgcolor: isDarkTheme ? 'rgba(38, 41, 45, 0.9)' : 'white',
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
                                color: isDarkTheme ? 'white' : 'text.primary',
                                mb: 1.5,
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              paragraph
                              sx={{
                                color: isDarkTheme ? 'grey.300' : 'text.secondary',
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
                                sx={{ color: isDarkTheme ? 'grey.400' : 'grey.600' }}
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
                      backgroundColor: isDarkTheme ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography variant="h6">
                      No articles found matching &quot;{searchQuery}&quot;
                    </Typography>
                    <Link href="/blog">
                      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Clear Search
                      </Button>
                    </Link>
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
                      backgroundColor: isDarkTheme ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: isDarkTheme ? 'primary.light' : 'primary.dark',
                      }}
                    >
                      Categories
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {categories.map((category: BlogCategory) => (
                        <Box
                          key={category.name}
                          component="li"
                          sx={{
                            py: 1,
                            borderBottom: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
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
                                color: isDarkTheme ? 'grey.300' : 'text.primary',
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
                      backgroundColor: isDarkTheme ? 'primary.dark' : 'primary.light',
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
                      backgroundColor: isDarkTheme ? 'rgba(38, 41, 45, 0.7)' : 'white',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: isDarkTheme ? 'primary.light' : 'primary.dark',
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
                            backgroundColor: isDarkTheme
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.05)',
                            color: isDarkTheme ? 'grey.300' : 'text.primary',
                            '&:hover': {
                              backgroundColor: isDarkTheme
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.1)',
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
        <section className={`py-16 ${isDarkTheme ? 'bg-gray-700' : 'bg-blue-100'}`}>
          <Container maxWidth="md">
            <Box className="text-center p-8 rounded-xl">
              <Typography
                variant="h3"
                component="h2"
                className="text-2xl md:text-3xl font-bold mb-4"
                sx={{ color: isDarkTheme ? 'primary.light' : 'primary.dark' }}
              >
                Ready to Start Your Meal Planning Journey?
              </Typography>
              <Typography
                variant="subtitle1"
                className="mb-8 max-w-2xl mx-auto"
                sx={{ color: isDarkTheme ? 'grey.300' : 'grey.700' }}
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
    </>
  );
}
