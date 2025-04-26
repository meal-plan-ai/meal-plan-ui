'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Footer, Header } from '@/components/organisms';

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
      <Header />
      {children}
      <Footer />
    </Box>
  );
}
