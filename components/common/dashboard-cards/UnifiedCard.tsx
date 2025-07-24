import { Card, CardContent, IconButton, Box } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import React from 'react';

interface UnifiedCardProps {
  onClick: () => void;
  children: React.ReactNode;
}

const UnifiedCard: React.FC<UnifiedCardProps> = ({ onClick, children }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: 2,
          pr: 6, // space for arrow
          '&:last-child': { pb: 2 },
        }}
      >
        {children}
      </CardContent>
      <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
        <IconButton size="small" color="primary">
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export { UnifiedCard };
