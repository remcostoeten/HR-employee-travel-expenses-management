'use client';

import { useAuth } from '../hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Spinner } from '@/shared/components/ui/spinner';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  fallback,
  redirectTo = '/login'
}: AuthGuardProps) {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (auth.status === 'loading') return;

    if (requireAuth && auth.status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      const loginUrl = new URL(redirectTo, window.location.origin);
      loginUrl.searchParams.set('redirect', currentPath);
      loginUrl.searchParams.set('message', 'Please log in to access this page');
      router.replace(loginUrl.toString());
      return;
    }

    if (requireAdmin && auth.status === 'authenticated' && auth.user?.role !== 'admin') {
      const loginUrl = new URL(redirectTo, window.location.origin);
      loginUrl.searchParams.set('message', 'You must be an admin to access this page');
      router.replace(loginUrl.toString());
      return;
    }
  }, [auth.status, auth.user, requireAuth, requireAdmin, router, redirectTo]);

  // Show loading state
  if (auth.status === 'loading') {
    return fallback || <AuthLoadingFallback />;
  }

  // Show nothing while redirecting
  if (requireAuth && auth.status === 'unauthenticated') {
    return null;
  }

  // Show nothing while redirecting admin
  if (requireAdmin && auth.status === 'authenticated' && auth.user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Convenience components
export function ProtectedRoute({ children, fallback, redirectTo }: Omit<AuthGuardProps, 'requireAuth'>) {
  return (
    <AuthGuard requireAuth={true} fallback={fallback} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
}

export function AdminRoute({ children, fallback, redirectTo }: Omit<AuthGuardProps, 'requireAuth' | 'requireAdmin'>) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true} fallback={fallback} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
}

export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
}
