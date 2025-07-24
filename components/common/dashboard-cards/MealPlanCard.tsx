import { UnifiedCard } from '@/components';
import { Box, Chip, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface MealPlan {
  id: string;
  name: string;
  durationInDays: number;
}

interface MealPlanCardProps {
  plan: MealPlan;
  onClick: (id: string) => void;
}

function MealPlanCard({ plan, onClick }: MealPlanCardProps) {
  return (
    <UnifiedCard onClick={() => onClick(plan.id)}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AssignmentIcon color="secondary" fontSize="small" />
          <Typography variant="subtitle1" component="h3" noWrap sx={{ fontWeight: 500 }}>
            {plan.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={`${plan.durationInDays} days`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
        </Box>
      </Box>
    </UnifiedCard>
  );
}

export { MealPlanCard };
