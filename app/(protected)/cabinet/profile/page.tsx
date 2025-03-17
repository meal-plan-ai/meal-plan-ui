'use client';

import { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  Alert,
  Collapse,
} from '@mui/material';
import { Camera as CameraIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNewPassword } from '@/api/query/auth/auth.query';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordError, setPasswordError] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const newPasswordMutation = useNewPassword();

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    gender: 'male',
    birthdate: '1990-01-01',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name as string]: value });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError({ ...passwordError, [name]: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prev => !prev);
  };

  const handleSave = () => {
    // Here will be API call to update profile
    console.log('Saving profile data:', profileData);
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    // Reset errors and success state
    setPasswordError({ currentPassword: '', newPassword: '' });
    setPasswordSuccess(false);

    // Basic validation
    let isValid = true;
    const newErrors = { ...passwordError };

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
      isValid = false;
    }

    if (!isValid) {
      setPasswordError(newErrors);
      return;
    }

    try {
      await newPasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Success
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '' });

      // Hide the form after a delay
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError({
        currentPassword: 'Current password may be incorrect',
        newPassword: '',
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'primary.main' }}>
              {profileData.firstName.charAt(0)}
              {profileData.lastName.charAt(0)}
            </Avatar>
            {editMode && (
              <Button
                variant="contained"
                size="small"
                startIcon={<CameraIcon />}
                sx={{
                  position: 'absolute',
                  right: -15,
                  bottom: -5,
                  borderRadius: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                Change
              </Button>
            )}
          </Box>

          <Box sx={{ ml: 3 }}>
            <Typography variant="h5">
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profileData.email}
            </Typography>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            {!editMode ? (
              <Button variant="outlined" color="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="inherit" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" disabled={!editMode}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleSelectChange}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  name="birthdate"
                  type="date"
                  value={profileData.birthdate}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>

        {!showPasswordForm ? (
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        ) : (
          <Box sx={{ mt: 2, maxWidth: 400 }}>
            <Collapse in={passwordSuccess}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Password changed successfully!
              </Alert>
            </Collapse>

            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              margin="normal"
              error={!!passwordError.currentPassword}
              helperText={passwordError.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New Password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              margin="normal"
              error={!!passwordError.newPassword}
              helperText={passwordError.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={toggleNewPasswordVisibility}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '' });
                  setPasswordError({ currentPassword: '', newPassword: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                disabled={newPasswordMutation.isPending}
              >
                {newPasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="error">
            Danger Zone
          </Typography>
          <Button variant="outlined" color="error" sx={{ mt: 1 }}>
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
