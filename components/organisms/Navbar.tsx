'use client';

import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ThemeToggle, ProfileMenu } from '@/components';
import { useDrawer } from '../providers/DrawerController';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { toggleDrawer } = useDrawer();
  const router = useRouter();

  const handleBuyPremium = () => {
    router.push('/checkout');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Meal Planning
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBuyPremium}
            sx={{
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme => theme.palette.secondary.dark,
              },
            }}
          >
            Buy Premium
          </Button>
          <ThemeToggle />
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export { Navbar };
