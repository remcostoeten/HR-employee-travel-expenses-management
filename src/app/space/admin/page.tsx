'use client';

import { AdminDashboard } from '@/modules/admin/ui/admin-dashboard';
import { AdminLayout } from '@/components/layouts/admin-layout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}