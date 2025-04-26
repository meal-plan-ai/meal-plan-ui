'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor?: string;
}

function FeatureCard({ icon, title, description, bgColor }: FeatureCardProps) {
  const { theme } = useTheme();

  return (
    <Paper
      elevation={theme === 'dark' ? 0 : 1}
      className="p-6 h-full"
      sx={{
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
        border: theme === 'dark' ? `1px solid rgba(255,255,255,0.1)` : 'none',
        borderRadius: '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          mb: 3,
          borderRadius: '12px',
          p: 2,
          width: 'fit-content',
          backgroundColor:
            bgColor || (theme === 'dark' ? 'rgba(66, 82, 169, 0.2)' : 'rgba(66, 82, 169, 0.1)'),
          color: theme === 'dark' ? 'primary.light' : 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme === 'dark' ? 'grey.400' : 'grey.600',
          flexGrow: 1,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}

export { FeatureCard };
