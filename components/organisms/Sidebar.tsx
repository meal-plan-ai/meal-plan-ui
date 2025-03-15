'use client';

import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface SidebarProps {
  variant: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/cabinet' },
  { title: 'My Characterisitcs', icon: <RestaurantIcon />, path: '/cabinet/characteristics' },
  { title: 'My Meal Plans', icon: <CalendarIcon />, path: '/cabinet/plans' },
  { title: 'Profile', icon: <AccountIcon />, path: '/cabinet/profile' },
];

export default function Sidebar({ variant, open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isMenuItemActive = (path: string) => pathname === path;

  const drawerProps = variant === 'temporary' ? {
    open,
    onClose,
    sx: {
      display: { xs: 'block', sm: 'none' },
      [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
    },
  } : {
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
            onClick={onClose}
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