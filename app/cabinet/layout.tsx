'use client';

import { ReactNode, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CabinetLayoutProps {
  children: ReactNode;
}

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/cabinet' },
    { title: 'My Characterisitcs', icon: <RestaurantIcon />, path: '/cabinet/characteristics' },
    { title: 'My Meal Plans', icon: <CalendarIcon />, path: '/cabinet/plans' },
    { title: 'Profile', icon: <AccountIcon />, path: '/cabinet/profile' },
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    // Logic for logout will be implemented later
    console.log('Logout clicked');
  };

  const isMenuItemActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
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

          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>J</Avatar>
          </IconButton>

          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem component={Link} href="/cabinet/profile" onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', mt: 8 },
        }}
      >
        <List>
          {menuItems.map(item => (
            <ListItem
              key={item.title}
              component={Link}
              href={item.path}
              sx={{
                bgcolor: isMenuItemActive(item.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                color: isMenuItemActive(item.path) ? 'primary.main' : 'text.primary',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isMenuItemActive(item.path) ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* For spacing below AppBar */}
        <List>
          {menuItems.map(item => (
            <ListItem
              key={item.title}
              component={Link}
              href={item.path}
              onClick={toggleDrawer}
              sx={{
                bgcolor: isMenuItemActive(item.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                color: isMenuItemActive(item.path) ? 'primary.main' : 'text.primary',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isMenuItemActive(item.path) ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
