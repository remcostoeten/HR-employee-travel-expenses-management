import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/modules/authenticatie/helpers/jwt';

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth/callback',
];

const authRoutes = [
  '/login',
  '/register',
];

const protectedRoutes = [
  '/space',
  '/profile',
  '/settings',
];

const adminRoutes = [
  '/admin',
];

// Helper function to check if a path matches any pattern
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern || path.startsWith(pattern + '/');
  });
}

// Helper function to get session from request
async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;

  try {
    const payload = await verifyJWT(token);
    if (!payload) return null;

    return {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api') && !pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Get session
  const session = await getSessionFromRequest(request);

  // Check if route is public
  if (matchesPattern(pathname, publicRoutes)) {
    // If user is authenticated and trying to access auth pages, redirect to space
    if (session && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/space', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (matchesPattern(pathname, protectedRoutes) || matchesPattern(pathname, adminRoutes)) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('message', 'Please log in to access this page');
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (matchesPattern(pathname, adminRoutes) && session.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('message', 'You must be an admin to access this page');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
