import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be accessible only to non-authenticated users
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/how-it-works',
  '/pricing',
  '/blog',
  '/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token');
  const isAuthenticated = !!token?.value;

  // Check if the path is public (auth pages)
  // Now also supports paths that start with '/blog/' for dynamic blog post pages
  const isPublicPath = publicPaths.some(
    path => pathname === path || (path === '/blog' && pathname.startsWith('/blog/'))
  );

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected pages while logged out, redirect to login
  if (!isPublicPath && !isAuthenticated && !pathname.startsWith('/_next')) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
