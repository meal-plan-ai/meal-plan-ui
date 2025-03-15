import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
