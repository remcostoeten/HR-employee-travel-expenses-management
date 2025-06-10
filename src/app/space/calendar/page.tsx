import { EmployeeCalendar } from '@/modules/employees/components/employee-calendar';
import { AppLayout } from '@/components/layouts/app-layout';
import { ProtectedRoute } from '@/modules/authenticatie/components/auth-guard';
import { Suspense } from 'react';

function CalendarLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Calendar</h1>
            <p className="text-muted-foreground">
              View and manage your daily work entries
            </p>
          </div>
          
          <Suspense fallback={<CalendarLoading />}>
            <EmployeeCalendar />
          </Suspense>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
