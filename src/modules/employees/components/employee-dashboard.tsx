'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { getEmployeeStatsAction } from '../api/actions/get-employee-stats-action';
import { Users, MapPin, Euro, TrendingUp, Car, Bike, Bus } from 'lucide-react';

type TEmployeeStats = {
  totalEmployees: number;
  totalDistanceKm: number;
  avgDistanceKm: number;
  totalMonthlyCostCents: number;
  travelTypeBreakdown: {
    travelType: 'car' | 'public' | 'bike';
    count: number;
    totalCostCents: number;
  }[];
};

const travelIcons = {
  car: Car,
  public: Bus,
  bike: Bike,
};

const travelColors = {
  car: 'text-blue-600',
  public: 'text-green-600',
  bike: 'text-orange-600',
};

export function EmployeeDashboard() {
  const [stats, setStats] = useState<TEmployeeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getEmployeeStatsAction();
        if (result.success) {
          setStats(result.data);
        } else {
          toast.error(result.error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch employee stats:', error);
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of employee travel expenses and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Active employees in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDistanceKm} km</div>
            <p className="text-xs text-muted-foreground">
              Avg: {Math.round(stats.avgDistanceKm)} km per employee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(stats.totalMonthlyCostCents / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total monthly travel expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Employee</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{stats.totalEmployees > 0 ? ((stats.totalMonthlyCostCents / 100) / stats.totalEmployees).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average monthly cost per employee
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Travel Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.travelTypeBreakdown.map((item) => {
                const Icon = travelIcons[item.travelType];
                const percentage = stats.totalEmployees > 0 ? (item.count / stats.totalEmployees * 100).toFixed(1) : '0';
                
                return (
                  <div key={item.travelType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${travelColors[item.travelType]}`} />
                      <span className="capitalize">{item.travelType}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.count} employees</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Travel Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.travelTypeBreakdown.map((item) => {
                const Icon = travelIcons[item.travelType];
                const percentage = stats.totalMonthlyCostCents > 0 ? (item.totalCostCents / stats.totalMonthlyCostCents * 100).toFixed(1) : '0';
                
                return (
                  <div key={item.travelType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${travelColors[item.travelType]}`} />
                      <span className="capitalize">{item.travelType}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">€{(item.totalCostCents / 100).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
