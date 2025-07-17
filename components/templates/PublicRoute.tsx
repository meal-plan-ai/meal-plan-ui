'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/next-client-api/users/users.hooks';

interface PublicRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

function PublicRoute({ children, redirectPath = '/dashboard' }: PublicRouteProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // If not loading and user is authenticated, redirect to dashboard
    if (!isLoading && user) {
      router.push(redirectPath);
    }
  }, [user, isLoading, error, router, redirectPath]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If user is authenticated, don't render anything (redirect is happening)
  if (user) {
    return null;
  }

  return <>{children}</>;
}

export { PublicRoute };
