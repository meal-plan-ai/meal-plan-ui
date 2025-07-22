import { Box, Typography, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { IMealPlan } from '@/api/nest-server-api/meal-plan/meal-plan.types';

interface MealPlanCardProps {
  plan: IMealPlan;
  onClick: (id: string) => void;
}

export default function MealPlanCard({ plan, onClick }: MealPlanCardProps) {
  return (
    <Card 
      variant="outlined"
      sx={{ 
        cursor: 'pointer',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <CardActionArea 
        onClick={() => onClick(plan.id)}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }}
      >
        <CardContent sx={{ 
          p: 2, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: 2 }
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AssignmentIcon color="secondary" fontSize="small" />
              <Typography 
                variant="subtitle1" 
                component="h3" 
                noWrap
                sx={{ fontWeight: 500 }}
              >
                {plan.name}
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 0.5, lineHeight: 1.3 }}
            >
              Duration: {plan.durationInDays} days
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 1, lineHeight: 1.3 }}
            >
              Created: {new Date(plan.createdAt).toLocaleDateString()}
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
            {plan.mealCharacteristic && (
              <Chip 
                size="small" 
                label="With Profile" 
                color="success" 
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '20px' }}
              />
            )}
            {plan.aiGeneratedMealPlan && (
              <Chip 
                size="small" 
                label="AI Generated" 
                color="info" 
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '20px' }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 