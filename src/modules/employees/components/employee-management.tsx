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

export function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
        <p className="text-muted-foreground">Manage employee travel expenses and overview</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Employee</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <EmployeeOverview />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <div className="max-w-2xl">
            <CreateEmployeeForm />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
