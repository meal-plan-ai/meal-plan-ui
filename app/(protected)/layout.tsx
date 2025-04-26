'use server';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { DrawerProvider } from '@/components/providers/DrawerController';
import { Navbar, Sidebar, ProtectedRoute } from '@/components';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
