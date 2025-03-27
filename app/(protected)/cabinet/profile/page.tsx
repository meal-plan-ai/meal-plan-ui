'use client';

import { Typography, Box, Paper, Avatar, CircularProgress, Alert } from '@mui/material';
import { useProfile } from '@/api/query/profile/profile.query';
import { useCurrentUser } from '@/api/query/users/users.query';
import ProfileInfoForm from './components/ProfileInfoForm';
import PasswordChangeForm from './components/PasswordChangeForm';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();
  const { data: currentUser } = useCurrentUser();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading profile: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {/* User avatar and basic info display */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}>
          {profile?.firstName?.charAt(0)}
          {profile?.lastName?.charAt(0)}
        </Avatar>
        <Box sx={{ ml: 3 }}>
          <Typography variant="h5">
            {profile?.firstName} {profile?.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
      </Paper>
      <ProfileInfoForm />
      <PasswordChangeForm />
    </Box>
  );
}
