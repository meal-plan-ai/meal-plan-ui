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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Camera as CameraIcon } from '@mui/icons-material';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    gender: 'male',
    birthdate: '1990-01-01',
    preferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      lowCarb: true,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name as string]: value });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [name]: checked,
      },
    });
  };

  const handleSave = () => {
    // Here will be API call to update profile
    console.log('Saving profile data:', profileData);
    setEditMode(false);
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

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Dietary Preferences
            </Typography>

            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.vegetarian}
                    onChange={handlePreferenceChange}
                    name="vegetarian"
                    disabled={!editMode}
                    color="primary"
                  />
                }
                label="Vegetarian"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.vegan}
                    onChange={handlePreferenceChange}
                    name="vegan"
                    disabled={!editMode}
                    color="primary"
                  />
                }
                label="Vegan"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.glutenFree}
                    onChange={handlePreferenceChange}
                    name="glutenFree"
                    disabled={!editMode}
                    color="primary"
                  />
                }
                label="Gluten Free"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.dairyFree}
                    onChange={handlePreferenceChange}
                    name="dairyFree"
                    disabled={!editMode}
                    color="primary"
                  />
                }
                label="Dairy Free"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.lowCarb}
                    onChange={handlePreferenceChange}
                    name="lowCarb"
                    disabled={!editMode}
                    color="primary"
                  />
                }
                label="Low Carb"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>

        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Change Password
        </Button>

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
