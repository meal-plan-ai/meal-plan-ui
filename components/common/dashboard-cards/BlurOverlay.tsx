import React from 'react';
import { Box, Button } from '@mui/material';

interface BlurOverlayProps {
  children: React.ReactNode;
  buttonLabel?: string;
  onShowAll: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  children,
  buttonLabel = 'Show all',
  onShowAll,
}) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        sx={{
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={onShowAll} sx={{ px: 4, py: 1.5 }}>
          {buttonLabel}
        </Button>
      </Box>
    </Box>
  );
};

export { BlurOverlay };
