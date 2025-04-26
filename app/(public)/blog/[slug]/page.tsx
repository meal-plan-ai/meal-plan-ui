'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Breadcrumbs,
  Divider,
  Avatar,
  Grid,
} from '@mui/material';
import {
  LocalOfferOutlined,
  PersonOutline,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  NavigateNext,
} from '@mui/icons-material';
import { Header, Footer } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useParams } from 'next/navigation';
import blogPostsData from '@/data/blogPosts.json';

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

// Data fetching function
function getPost(slug: string): BlogPost | undefined {
  // In a real app, this would be a database or API call
  // For now, we're using the static JSON data
  return blogPostsData.find(post => post.slug === slug);
}

export default function BlogPostPage() {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const params = useParams();
  const slug = params.slug as string;

  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  // Select related posts (excluding current post)
  const relatedPosts = blogPostsData
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2) as BlogPost[];

  return (
    <>
      <Header />
      <main
        className={`min-h-screen ${
          isDarkTheme
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
            : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'
        }`}
      >
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '300px', md: '400px' },
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
              },
            }}
          >
            <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
          </Box>
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
              zIndex: 2,
            }}
          >
            <Box sx={{ maxWidth: 800 }}>
              <Chip
                label={post.category}
                size="small"
                icon={<LocalOfferOutlined />}
                color="primary"
                sx={{ mb: 2 }}
              />
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                {post.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonOutline fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{post.author}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayOutlined fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{post.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeOutlined fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{post.readTime}</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Breadcrumbs */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: isDarkTheme ? 'grey.400' : 'grey.600' }}
          >
            <Link href="/" passHref>
              <Typography
                sx={{
                  color: isDarkTheme ? 'grey.400' : 'grey.600',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Home
              </Typography>
            </Link>
            <Link href="/blog" passHref>
              <Typography
                sx={{
                  color: isDarkTheme ? 'grey.400' : 'grey.600',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Blog
              </Typography>
            </Link>
            <Typography color={isDarkTheme ? 'grey.300' : 'text.primary'}>{post.title}</Typography>
          </Breadcrumbs>
        </Container>

        {/* Article Content */}
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 2,
                  backgroundColor: isDarkTheme ? 'rgba(38, 41, 45, 0.9)' : 'white',
                  boxShadow: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.2rem',
                    mb: 4,
                    color: isDarkTheme ? 'grey.300' : 'text.secondary',
                  }}
                >
                  {post.excerpt}
                </Typography>

                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: isDarkTheme ? 'grey.200' : 'text.primary',
                    lineHeight: 1.8,
                    '& p': { mb: 3 },
                    '& h2': {
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mt: 4,
                      mb: 2,
                      color: isDarkTheme ? 'primary.light' : 'primary.dark',
                    },
                    '& h3': {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      mt: 3,
                      mb: 2,
                      color: isDarkTheme ? 'primary.light' : 'primary.dark',
                    },
                  }}
                >
                  {/* This would normally be formatted HTML content */}
                  <p>{post.content}</p>
                </Typography>

                {/* Tags */}
                <Box sx={{ mt: 5 }}>
                  <Divider
                    sx={{
                      borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      mb: 3,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: isDarkTheme ? 'grey.400' : 'grey.700',
                        mr: 1,
                      }}
                    >
                      Tags:
                    </Typography>
                    {['Nutrition', 'Health', 'Meal Planning'].map(tag => (
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
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Author Box */}
                <Box
                  sx={{
                    mt: 5,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {post.author.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: isDarkTheme ? 'primary.light' : 'primary.dark',
                      }}
                    >
                      About {post.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkTheme ? 'grey.300' : 'text.secondary',
                        mt: 1,
                      }}
                    >
                      A nutrition expert with over 10 years of experience in meal planning and
                      dietary consulting. Passionate about making healthy eating accessible and
                      enjoyable for everyone.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                {/* Related Posts */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: isDarkTheme ? 'rgba(38, 41, 45, 0.9)' : 'white',
                    boxShadow: 2,
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: isDarkTheme ? 'primary.light' : 'primary.dark',
                    }}
                  >
                    Related Articles
                  </Typography>

                  {relatedPosts.length > 0 ? (
                    relatedPosts.map(relatedPost => (
                      <Box
                        key={relatedPost.id}
                        sx={{
                          mb: 3,
                          pb: 3,
                          borderBottom: isDarkTheme
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(0,0,0,0.1)',
                          '&:last-child': {
                            mb: 0,
                            pb: 0,
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <Link href={`/blog/${relatedPost.slug}`} passHref>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              textDecoration: 'none',
                              '&:hover h4': { color: 'primary.main' },
                            }}
                          >
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                position: 'relative',
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src={relatedPost.image}
                                alt={relatedPost.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                component="h4"
                                sx={{
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  color: isDarkTheme ? 'grey.300' : 'text.primary',
                                  transition: 'color 0.2s',
                                }}
                              >
                                {relatedPost.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isDarkTheme ? 'grey.500' : 'text.secondary',
                                  display: 'block',
                                  mt: 0.5,
                                }}
                              >
                                {relatedPost.date}
                              </Typography>
                            </Box>
                          </Box>
                        </Link>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkTheme ? 'grey.400' : 'grey.600',
                      }}
                    >
                      No related articles found.
                    </Typography>
                  )}
                </Paper>

                {/* Newsletter Widget */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: isDarkTheme ? 'primary.dark' : 'primary.light',
                    color: 'white',
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Enjoy this article?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Subscribe to our newsletter for more nutrition tips, recipes, and meal planning
                    advice.
                  </Typography>
                  <Link href="/newsletter" passHref>
                    <Box
                      component="button"
                      sx={{
                        display: 'block',
                        width: '100%',
                        py: 1.5,
                        px: 2,
                        backgroundColor: 'white',
                        color: 'primary.main',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 1,
                        cursor: 'pointer',
                        textAlign: 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Subscribe Now
                    </Box>
                  </Link>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
      <Footer />
    </>
  );
}
