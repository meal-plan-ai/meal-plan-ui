'use client';

import { Paper, Typography, Box, Button } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface PlatformCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  disabled?: boolean;
}

function PlatformCard({
  icon,
  title,
  description,
  image,
  buttonText,
  buttonLink,
  disabled = false,
}: PlatformCardProps) {
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
        overflow: 'hidden',
      }}
    >
      <Box className="flex items-center mb-4">
        <Box
          sx={{
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? 'rgba(66, 99, 235, 0.2)' : 'rgba(66, 99, 235, 0.1)',
            color: theme === 'dark' ? 'primary.light' : 'primary.main',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: theme === 'dark' ? 'grey.400' : 'grey.600',
          mb: 3,
        }}
      >
        {description}
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          position: 'relative',
          maxHeight: '280px',
        }}
      >
        <img
          src={image}
          alt={`${title} platform`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />
      </Box>

      {buttonText && (
        <Button
          variant="contained"
          color="primary"
          href={buttonLink}
          disabled={disabled}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '8px',
            fontWeight: 500,
            opacity: disabled ? 0.7 : 1,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
}

export { PlatformCard };
