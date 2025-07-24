import { Grid } from '@mui/material';
import { NutritionProfilesSection, MealPlansSection } from '@/components';

interface DashboardOverviewSectionProps {
  onProfileClick: (id: string) => void;
  onMealPlanClick: (id: string) => void;
  onCreateProfile: () => void;
  onCreateMealPlan: () => void;
}
function DashboardOverviewSection({
  onProfileClick,
  onMealPlanClick,
  onCreateProfile,
  onCreateMealPlan,
}: DashboardOverviewSectionProps) {
  return (
    <>
      <Grid item xs={12} md={6}>
        <NutritionProfilesSection
          onProfileClick={onProfileClick}
          onCreateClick={onCreateProfile}
          limit={5}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MealPlansSection onPlanClick={onMealPlanClick} onCreateClick={onCreateMealPlan} />
      </Grid>
    </>
  );
}

export { DashboardOverviewSection };
