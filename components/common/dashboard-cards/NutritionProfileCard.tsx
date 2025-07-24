import { UnifiedCard } from '@/components';
import { Box, Chip, Typography } from '@mui/material';

interface NutritionProfileCardProps {
  characteristic: {
    id: string;
    planName: string;
    targetDailyCalories: number;
    dietaryRestrictions?: string[];
  };
  onClick: (id: string) => void;
}

function NutritionProfileCard({ characteristic, onClick }: NutritionProfileCardProps) {
  return (
    <UnifiedCard onClick={() => onClick(characteristic.id)}>
      <Box>
        <Typography variant="subtitle1" component="div" gutterBottom>
          {characteristic.planName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={`${characteristic.targetDailyCalories} cal`} color="primary" />
          {characteristic.dietaryRestrictions?.map((restriction, index) => (
            <Chip key={index} size="small" label={restriction} variant="outlined" />
          ))}
        </Box>
      </Box>
    </UnifiedCard>
  );
}

export { NutritionProfileCard };
