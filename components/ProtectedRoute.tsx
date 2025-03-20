'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/query/users/users.query';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  fallbackPath = '/auth/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}