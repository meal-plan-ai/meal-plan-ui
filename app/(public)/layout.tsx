'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  );
}