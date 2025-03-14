'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';
import LoadingProgress from './LoadingProgress';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProgress />
      {children}
    </MuiThemeProvider>
  );
}
