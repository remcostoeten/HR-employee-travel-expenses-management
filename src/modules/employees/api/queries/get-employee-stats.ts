'use server';
import { db } from '@/api/db/connection';
import { employees } from '../../schemas';
import { sql } from 'drizzle-orm';

export async function getEmployeeStats() {
  const stats = await db
    .select({
      totalEmployees: sql<number>`count(*)`,
      totalDistanceKm: sql<number>`sum(${employees.distanceKm})`,
      avgDistanceKm: sql<number>`avg(${employees.distanceKm})`,
      totalMonthlyCostCents: sql<number>`sum(${employees.distanceKm} * ${employees.euroPerKm} * json_array_length(${employees.officeDays}))`,
    })
    .from(employees);

  const travelTypeStats = await db
    .select({
      travelType: employees.travelType,
      count: sql<number>`count(*)`,
      totalCostCents: sql<number>`sum(${employees.distanceKm} * ${employees.euroPerKm} * json_array_length(${employees.officeDays}))`,
    })
    .from(employees)
    .groupBy(employees.travelType);

  return {
    ...stats[0],
    travelTypeBreakdown: travelTypeStats,
  };
}
