import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { NutritionProfileCard } from './NutritionProfileCard';
import { BlurOverlay } from '@/components/common';
import { INutritionProfileCharacteristic } from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';

const NutritionProfileCardsList = ({
  mealCharacteristics,
  onProfileClick,
  showAll,
}: {
  showAll: boolean;
  mealCharacteristics: INutritionProfileCharacteristic[];
  onProfileClick: (id: string) => void;
}) => {
  const router = useRouter();

  return (
    <Stack spacing={2} sx={{ maxHeight: showAll ? 'auto' : 280, overflow: 'auto', pr: 1 }}>
      {mealCharacteristics
        .slice(0, showAll ? mealCharacteristics.length : 3)
        .map((characteristic, idx) =>
          !showAll && idx === 2 ? (
            <BlurOverlay key={characteristic.id} onShowAll={() => router.push('/characteristics')}>
              <NutritionProfileCard
                characteristic={{
                  id: characteristic.id,
                  planName: characteristic.planName,
                  targetDailyCalories: characteristic.targetDailyCalories || 0,
                  dietaryRestrictions: characteristic.dietaryRestrictions || [],
                }}
                onClick={onProfileClick}
              />
            </BlurOverlay>
          ) : (
            <NutritionProfileCard
              key={characteristic.id}
              characteristic={{
                id: characteristic.id,
                planName: characteristic.planName,
                targetDailyCalories: characteristic.targetDailyCalories || 0,
                dietaryRestrictions: characteristic.dietaryRestrictions || [],
              }}
              onClick={onProfileClick}
            />
          )
        )}
    </Stack>
  );
};

export { NutritionProfileCardsList };
