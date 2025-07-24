import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { IMealCharacteristic } from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';

interface NutritionProfileCardProps {
  characteristic: IMealCharacteristic;
  onClick: (id: string) => void;
}

export function NutritionProfileCard({ characteristic, onClick }: NutritionProfileCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      onClick={() => onClick(characteristic.id)}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" component="div" gutterBottom>
            {characteristic.planName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`${characteristic.targetDailyCalories} cal`}
              color="primary"
            />
            {characteristic.dietaryRestrictions?.map((restriction, index) => (
              <Chip key={index} size="small" label={restriction} variant="outlined" />
            ))}
          </Box>
        </Box>
        <IconButton size="small" color="primary">
          <ArrowForwardIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
