'use client';

import { useState } from 'react';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { logout } from '@/api/actions/auth.actions';
import { useRouter } from 'next/navigation';

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <>
      <IconButton color="inherit" onClick={handleProfileMenuOpen}>
        {user?.avatar ? (
          <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>{userInitial}</Avatar>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
    </>
  );
} 