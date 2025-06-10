'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Container
} from '@/shared/components/ui';
import { CreateEmployeeForm } from './create-employee-form';
import { EmployeeOverview } from './employee-overview';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';

export function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const auth = useAuth();
  const isAdmin = auth.user?.role === 'admin';

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isAdmin ? 'Employee Management' : 'My Employee Records'}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? 'Manage employee travel expenses and overview'
            : 'View your employee travel records and expenses'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full max-w-md ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="overview">
            {isAdmin ? 'Overview' : 'My Records'}
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="create">Create Employee</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <EmployeeOverview />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl">
              <CreateEmployeeForm />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Container>
  );
}
