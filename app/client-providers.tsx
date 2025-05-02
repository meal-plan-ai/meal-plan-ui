'use client';

import QueryProvider from '@/providers/QueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ToastProvider from '@/components/providers/toast-provider';
import ThemeProviderWrapper from '@/components/providers/ThemeProviderWrapper';
import StripeProvider from '@/components/providers/StripeProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProviderWrapper>
        <ToastProvider>
          <StripeProvider>{children}</StripeProvider>
        </ToastProvider>
      </ThemeProviderWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
