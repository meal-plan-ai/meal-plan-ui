import { Paper, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { RestaurantMenu as RestaurantMenuIcon } from '@mui/icons-material';
import { useMealCharacteristics } from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import { EmptyState } from '@/components';

import { NutritionProfileCardsList } from './NutritionProfileCardsList';

interface NutritionProfilesSectionProps {
  onProfileClick: (id: string) => void;
  onCreateClick: () => void;
  limit?: number;
}

function NutritionProfilesSection({
  onProfileClick,
  onCreateClick,
  limit = 5,
}: NutritionProfilesSectionProps) {
  const { data: mealCharacteristics, isLoading, error } = useMealCharacteristics(1, limit);

  return (
    <Paper sx={{ p: 3, height: 350, overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RestaurantMenuIcon color="primary" />
        Nutrition Profiles
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load nutrition profiles</Alert>
      ) : mealCharacteristics?.data && mealCharacteristics.data.length > 0 ? (
        <NutritionProfileCardsList
          mealCharacteristics={mealCharacteristics.data}
          onProfileClick={onProfileClick}
          showAll={false}
        />
      ) : (
        <EmptyState
          icon={<RestaurantMenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          title="No nutrition profiles found"
          description="Create your first nutrition profile to get started"
          actionLabel="Create Profile"
          onAction={onCreateClick}
        />
      )}
    </Paper>
  );
}

export { NutritionProfilesSection };
