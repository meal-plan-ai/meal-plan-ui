'use client';

import { Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';

interface AwardBadgeProps {
  icon: React.ReactNode;
  title: string;
  organization: string;
  year: string;
  accentColor?: string;
}

function AwardBadge({
  icon,
  title,
  organization,
  year,
  accentColor = 'rgba(156, 204, 101, 0.2)',
}: AwardBadgeProps) {
  const { theme } = useTheme();

  return (
    <Paper
      elevation={0}
      className="p-4 text-center h-full flex items-center"
      sx={{
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: accentColor,
          mr: 2,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box className="text-left">
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {organization} • {year}
        </Typography>
      </Box>
    </Paper>
  );
}

export { AwardBadge };
