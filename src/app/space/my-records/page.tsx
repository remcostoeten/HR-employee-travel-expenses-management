import { EmployeeManagement } from '@/modules/employees/components';
import { AppLayout } from '@/components/layouts/app-layout';
import { ProtectedRoute } from '@/modules/authenticatie/components/auth-guard';
import { Suspense } from 'react';

function EmployeeLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export default function MyRecordsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Suspense fallback={<EmployeeLoading />}>
          <EmployeeManagement />
        </Suspense>
      </AppLayout>
    </ProtectedRoute>
  );
}
