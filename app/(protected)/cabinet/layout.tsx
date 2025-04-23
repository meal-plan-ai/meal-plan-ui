'use server';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import { DrawerProvider } from '@/components/providers/DrawerController';

interface CabinetLayoutProps {
  children: ReactNode;
}

export default async function CabinetLayout({ children }: CabinetLayoutProps) {
  return (
    <DrawerProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar />
        <Sidebar variant="permanent" />
        <Sidebar variant="temporary" />

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </DrawerProvider>
  );
}
