'use client';

import { usePathname } from 'next/navigation';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as AccountIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useDrawer } from '../providers/DrawerController';

interface SidebarProps {
  variant: 'permanent' | 'temporary';
}

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Nutrition Profiles', icon: <RestaurantIcon />, path: '/characteristics' },
  { title: 'Meal Plans', icon: <CalendarIcon />, path: '/plans' },
  { title: 'Subscription', icon: <CreditCardIcon />, path: '/subscription' },
  { title: 'Profile', icon: <AccountIcon />, path: '/profile' },
];

function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const { drawerOpen, toggleDrawer } = useDrawer();

  const isMenuItemActive = (path: string) => pathname === path;

  const drawerProps =
    variant === 'temporary'
      ? {
          open: drawerOpen,
          onClose: toggleDrawer,
          sx: {
            display: { xs: 'block', sm: 'none' },
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
          },
        }
      : {
          sx: {
            width: 240,
            flexShrink: 0,
            display: { xs: 'none', sm: 'block' },
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', mt: 8 },
          },
        };

  return (
    <Drawer variant={variant} {...drawerProps}>
      {variant === 'temporary' && <Toolbar />}
      <List>
        {menuItems.map(item => (
          <ListItem
            key={item.title}
            component={Link}
            href={item.path}
            onClick={variant === 'temporary' ? toggleDrawer : undefined}
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
  );
}

export { Sidebar };
