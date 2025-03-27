import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';
import { Inter } from 'next/font/google';
import ToastProvider from '@/components/toast-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
