import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
      }}
    >
      {icon}
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Button variant="contained" color="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    </Box>
  );
}
