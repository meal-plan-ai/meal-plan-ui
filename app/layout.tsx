import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
