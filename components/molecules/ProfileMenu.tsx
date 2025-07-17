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
import { AccountCircle as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useProfile } from '@/api/next-client-api/profile/profile.hooks';
import { useCurrentUser } from '@/api/next-client-api/users/users.hooks';
import { useLogout } from '@/api/next-client-api/auth/auth.hooks';

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: user } = useCurrentUser();
  const { data: profile } = useProfile();
  const { mutateAsync: logout } = useLogout();

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
    } catch (error) {
      console.error('Logout failed:', error);
      // Error handling is now done in the hook
      handleProfileMenuClose();
    }
  };

  if (!user) {
    return null;
  }

  const userInitial = profile?.firstName
    ? profile?.firstName[0].toUpperCase()
    : user.email
      ? user.email[0].toUpperCase()
      : 'U';

  return (
    <>
      <IconButton color="inherit" onClick={handleProfileMenuOpen}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>{userInitial}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose}>
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

export { ProfileMenu };
