'use server';

import ProtectedRoute from '@/components/templates/ProtectedRoute';
import { ReactNode } from 'react';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
