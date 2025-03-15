'use client';

import { ReactNode, useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';

interface CabinetLayoutProps {
  children: ReactNode;
}

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={toggleDrawer} />
      <Sidebar variant="permanent" />
      <Sidebar variant="temporary" open={drawerOpen} onClose={toggleDrawer} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
} 