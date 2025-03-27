'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/query/users/users.query';

interface PublicRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function PublicRoute({ children, redirectPath = '/' }: PublicRouteProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectPath);
    }
  }, [user, isLoading, router, redirectPath]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
