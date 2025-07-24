import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { MealCharacteristic } from '@/api/api.types';

interface NutritionProfileCardProps {
  characteristic: MealCharacteristic;
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
            {characteristic.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`${characteristic.targetCalories} cal`} color="primary" />
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
