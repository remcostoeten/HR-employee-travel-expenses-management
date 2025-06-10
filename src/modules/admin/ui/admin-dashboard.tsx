'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Container
} from '@/shared/components/ui';
import { UserManagement } from './user-management';
import { SystemSettings } from './system-settings';
import { AdminStats } from './admin-stats';
import { TravelCostSettings } from './travel-cost-settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your application settings and users</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="travel-costs">Travel Costs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <AdminStats />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="travel-costs" className="space-y-6">
          <TravelCostSettings />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </Container>
  );
}