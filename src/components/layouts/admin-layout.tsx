'use client';

import { AdminRoute } from '@/modules/authenticatie/components/auth-guard';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { toast } from '@/shared/components/toast';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ 
  children, 
  title = "Admin Dashboard",
  description = "Manage your application settings and users."
}: AdminLayoutProps) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader title={title} description={description} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}

function AdminHeader({ title, description }: { title: string; description: string }) {
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
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                Admin
              </span>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {auth.user?.name || auth.user?.email}
            </span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-destructive hover:text-destructive/80"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
