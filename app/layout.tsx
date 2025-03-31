import QueryProvider from '@/providers/QueryProvider';
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ToastProvider from '@/components/providers/toast-provider';
import ThemeProviderWrapper from '@/components/providers/ThemeProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProviderWrapper>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProviderWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
