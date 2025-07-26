import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import { EmptyState } from '@/components/atoms';
import { RestaurantMenu as RestaurantMenuIcon } from '@mui/icons-material';
import { Alert, CircularProgress, Box, Typography, Button } from '@mui/material';
import { NutritionProfileCardsList } from '@/components/common/dashboard-cards/NutritionProfileCardsList';

const Step1Content = () => {
  const { data: mealCharacteristics, isLoading, error } = useMealCharacteristics();

  const handleCreateProfile = () => {
    console.log('create profile');
  };

  const handleProfileClick = (id: string) => {
    console.log('profile clicked', id);
  };

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }
    if (error) {
      return <Alert severity="error">Failed to load nutrition profiles</Alert>;
    }
    if (mealCharacteristics?.data && mealCharacteristics.data.length === 0) {
      return (
        <EmptyState
          icon={<RestaurantMenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          title="No nutrition profiles found"
          description="Create your first nutrition profile to get started"
          actionLabel="Create Profile"
          onAction={handleCreateProfile}
        />
      );
    }
    if (mealCharacteristics?.data && mealCharacteristics.data.length > 0) {
      return (
        <Box
          sx={{
            maxHeight: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant="contained" color="primary" onClick={handleCreateProfile}>
            Create New Nutrition Profile
          </Button>
          <Typography variant="body1" paragraph>
            Or select from your existing nutrition profiles
          </Typography>
          <Box sx={{ width: '100%' }}>
            <NutritionProfileCardsList
              mealCharacteristics={mealCharacteristics.data}
              onProfileClick={handleProfileClick}
              showAll={true}
            />
          </Box>
        </Box>
      );
    }
    return null;
  };

  return <Box>{renderContent()}</Box>;
};

export { Step1Content };
