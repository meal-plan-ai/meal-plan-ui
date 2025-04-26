'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { IMealPlan } from '@/api/nest-server-api/meal-plan/meal-plan.types';
import DayPlanCard from './DayPlanCard';

interface PlanScheduleViewProps {
  mealPlan: IMealPlan;
  title?: string;
}

const PlanScheduleView: React.FC<PlanScheduleViewProps> = ({
  mealPlan,
  title = 'Your Meal Plan Schedule',
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const generatedPlan = mealPlan.aiGeneratedMealPlan?.generatedPlan;

  const days = generatedPlan?.days.slice(0, 7);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320; // Card width + margin
      const scrollTo =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };

  // Navigate to detailed day view page
  const handleDayClick = (dayNumber: number) => {
    router.push(`/cabinet/meal-plan/${mealPlan.id}/day/${dayNumber}`);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Check initial scroll state
      handleScroll();

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Recheck scroll abilities when window resizes
  useEffect(() => {
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <Container>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'transparent', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {title}
          </Typography>

          {days && days.length > (isMobile ? 1 : isTablet ? 2 : 3) && (
            <Box>
              <IconButton
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                color="primary"
                size="small"
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '3px',
            },
          }}
        >
          {days &&
            days.map(day => (
              <Box key={uuidv4()} sx={{ flex: '0 0 auto' }}>
                <DayPlanCard dayPlan={day} onClick={() => handleDayClick(day.dayNumber)} />
              </Box>
            ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default PlanScheduleView;
