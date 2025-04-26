'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  Container,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, Close } from '@mui/icons-material';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1.5, px: 0 }}>
          {/* Logo */}
          <Link href="/" className="flex items-center no-underline">
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: theme === 'dark' ? 'primary.light' : 'primary.dark',
              }}
            >
              NutriPlan
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, flexGrow: 1 }}>
            {navItems.map(item => (
              <Link href={item.href} key={item.label} className="no-underline">
                <Button
                  sx={{
                    mx: 1,
                    color: theme === 'dark' ? 'grey.300' : 'grey.700',
                    '&:hover': {
                      backgroundColor:
                        theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Spacer for mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} />

          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} sx={{ ml: 1 }}>
            {theme === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* Auth Buttons (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Link href="/auth/login" className="no-underline">
              <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
                Log In
              </Button>
            </Link>
            <Link href="/auth/register" className="no-underline">
              <Button variant="contained" color="primary">
                Sign Up
              </Button>
            </Link>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{ display: { md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '300px',
            backgroundColor: theme === 'dark' ? 'grey.900' : 'white',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleMobileMenu}>
            <Close />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {navItems.map(item => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <Link href={item.href} onClick={toggleMobileMenu} className="w-full no-underline">
                <Button
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    color: theme === 'dark' ? 'grey.300' : 'grey.700',
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ my: 2 }}>
            <Link href="/auth/login" className="w-full no-underline" onClick={toggleMobileMenu}>
              <Button variant="outlined" color="primary" fullWidth sx={{ mb: 1 }}>
                Log In
              </Button>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/auth/register" className="w-full no-underline" onClick={toggleMobileMenu}>
              <Button variant="contained" color="primary" fullWidth>
                Sign Up
              </Button>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}

export { Header };
