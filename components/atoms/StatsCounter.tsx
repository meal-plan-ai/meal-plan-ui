'use client';

import { Box, Typography } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface StatsCounterProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconColor?: string;
}

export default function StatsCounter({
  icon,
  value,
  label,
  iconColor = 'primary.main',
}: StatsCounterProps) {
  const { theme } = useTheme();

  return (
    <Box className="text-center">
      <Box
        sx={{
          color: iconColor,
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h2"
        component="div"
        sx={{
          fontWeight: 700,
          color: theme === 'dark' ? 'primary.light' : 'primary.main',
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme === 'dark' ? 'grey.400' : 'grey.600',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
