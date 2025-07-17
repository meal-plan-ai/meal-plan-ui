'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/next-client-api/users/users.hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

function ProtectedRoute({ children, fallbackPath = '/auth/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // If not loading and no user data, redirect to login
    if (!isLoading && !user) {
      router.push(fallbackPath);
    }
  }, [user, isLoading, error, router, fallbackPath]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If no user, don't render anything (redirect is happening)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export { ProtectedRoute };
