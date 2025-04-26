'use client';

import { Paper, Typography, Box, Rating, Avatar } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

interface TestimonialCardProps {
  name: string;
  avatar: string;
  role: string;
  review: string;
  rating: number;
}

function TestimonialCard({ name, avatar, role, review, rating }: TestimonialCardProps) {
  const { theme } = useTheme();

  return (
    <Paper
      elevation={3}
      className="p-6 h-full flex flex-col"
      sx={{
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
        height: '100%',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        borderRadius: '12px',
      }}
    >
      <Rating value={rating} precision={0.5} readOnly className="mb-4" />
      <Typography variant="body1" paragraph className="flex-grow italic">
        &ldquo;{review}&rdquo;
      </Typography>
      <Box className="flex items-center mt-3">
        <Avatar src={avatar} alt={name} className="mr-3" />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export { TestimonialCard };
