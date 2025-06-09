'use client';

import { AdminDashboard } from '@/modules/admin/ui/admin-dashboard';
import { AppLayout } from '@/components/layouts/app-layout';

export default function AdminPage() {
  return (
    <AppLayout>
      <AdminDashboard />
    </AppLayout>
  );
}