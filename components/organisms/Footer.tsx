'use client';

import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { Box, Container, Grid, Typography, Divider, Stack, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

function Footer() {
  const { theme } = useTheme();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQs', href: '/faqs' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com' },
    { icon: <Twitter />, href: 'https://twitter.com' },
    { icon: <Instagram />, href: 'https://instagram.com' },
    { icon: <LinkedIn />, href: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: theme === 'dark' ? 'grey.900' : 'grey.100',
        color: theme === 'dark' ? 'grey.300' : 'grey.800',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme === 'dark' ? 'primary.light' : 'primary.dark',
              }}
            >
              NutriPlan
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, maxWidth: '300px' }}>
              The most advanced AI-powered meal planning platform. Create personalized nutrition
              plans that match your preferences and goals.
            </Typography>

            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: theme === 'dark' ? 'grey.400' : 'grey.600',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map(section => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme === 'dark' ? 'grey.300' : 'grey.700',
                }}
              >
                {section.title.toUpperCase()}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map(link => (
                  <Link key={link.label} href={link.href} className="no-underline">
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme === 'dark' ? 'grey.400' : 'grey.600',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: theme === 'dark' ? 'grey.300' : 'grey.700',
              }}
            >
              DOWNLOAD OUR APP
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Get our mobile app for the best experience
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'block',
                    width: 120,
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <img
                    src="/images/app-store-badge.png"
                    alt="Download on the App Store"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'block',
                    width: 120,
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <img
                    src="/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 4,
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: theme === 'dark' ? 'grey.500' : 'grey.600' }}>
            © {new Date().getFullYear()} NutriPlan. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: theme === 'dark' ? 'grey.500' : 'grey.600' }}>
            Made with ♥ for healthy living
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export { Footer };
