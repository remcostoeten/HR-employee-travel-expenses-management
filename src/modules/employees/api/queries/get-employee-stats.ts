'use server';
import { db } from '@/api/db/connection';
import { employees } from '../../schemas';
import { sql, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function getEmployeeStats() {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }
  // Build base query
  let statsQuery = db
    .select({
      totalEmployees: sql<number>`count(*)`,
      totalDistanceKm: sql<number>`sum(${employees.distanceKm})`,
      avgDistanceKm: sql<number>`avg(${employees.distanceKm})`,
      totalMonthlyCostCents: sql<number>`sum(${employees.distanceKm} * ${employees.euroPerKm} * json_array_length(${employees.officeDays}))`,
    })
    .from(employees);

  // If not admin, only show stats for user's employees
  if (userResult.user.role !== 'admin') {
    statsQuery = statsQuery.where(eq(employees.userId, userResult.user.id!));
  }

  const stats = await statsQuery;

  // Build travel type stats query
  let travelTypeQuery = db
    .select({
      travelType: employees.travelType,
      count: sql<number>`count(*)`,
      totalCostCents: sql<number>`sum(${employees.distanceKm} * ${employees.euroPerKm} * json_array_length(${employees.officeDays}))`,
    })
    .from(employees);

  // If not admin, only show stats for user's employees
  if (userResult.user.role !== 'admin') {
    travelTypeQuery = travelTypeQuery.where(eq(employees.userId, userResult.user.id!));
  }

  const travelTypeStats = await travelTypeQuery.groupBy(employees.travelType);

  return {
    ...stats[0],
    travelTypeBreakdown: travelTypeStats,
  };
}
