'use client';

import { ProtectedRoute } from '@/modules/authenticatie/components/auth-guard';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { toast } from '@/shared/components/toast';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export function ProtectedLayout({ 
  children, 
  showHeader = true, 
  title,
  description 
}: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {showHeader && (
          <Header title={title} description={description} />
        )}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function Header({ title, description }: { title?: string; description?: string }) {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success('Successfully logged out');
        router.replace('/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {title || `Welcome back, ${auth.user?.name || 'User'}!`}
            </h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-destructive hover:text-destructive/80"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
