'use client';

import { Box, Typography } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export default function StepCard({ number, title, description }: StepCardProps) {
  const { theme } = useTheme();

  return (
    <Box className="text-center px-4">
      <Box
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
        sx={{ backgroundColor: 'primary.main' }}
      >
        {number}
      </Box>
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        fontWeight={600}
        sx={{
          color: theme === 'dark' ? 'white' : 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme === 'dark' ? 'grey.300' : 'text.secondary',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
