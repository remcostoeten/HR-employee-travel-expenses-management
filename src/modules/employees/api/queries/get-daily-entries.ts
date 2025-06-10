'use server';

import { db } from '@/api/db/connection';
import { dailyEntries, employees } from '../../schemas';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

type TGetEntriesInput = {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  employeeId?: string;
};

export async function getDailyEntries(input: TGetEntriesInput = {}) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    let query = db
      .select({
        id: dailyEntries.id,
        employeeId: dailyEntries.employeeId,
        date: dailyEntries.date,
        entryType: dailyEntries.entryType,
        startTime: dailyEntries.startTime,
        endTime: dailyEntries.endTime,
        breakMinutes: dailyEntries.breakMinutes,
        notes: dailyEntries.notes,
        travelCostCents: dailyEntries.travelCostCents,
        isApproved: dailyEntries.isApproved,
        approvedBy: dailyEntries.approvedBy,
        approvedAt: dailyEntries.approvedAt,
        createdAt: dailyEntries.createdAt,
        updatedAt: dailyEntries.updatedAt,
        // Join employee data
        employeeName: employees.name,
        employeeTravelType: employees.travelType,
      })
      .from(dailyEntries)
      .leftJoin(employees, eq(dailyEntries.employeeId, employees.id));

    // Build where conditions
    const conditions = [];

    // If not admin, only show entries for user's employees
    if (userResult.user.role !== 'admin') {
      conditions.push(eq(dailyEntries.userId, userResult.user.id!));
    }

    // Filter by employee if specified
    if (input.employeeId) {
      conditions.push(eq(dailyEntries.employeeId, input.employeeId));
    }

    // Filter by date range if specified
    if (input.startDate) {
      conditions.push(gte(dailyEntries.date, input.startDate));
    }
    if (input.endDate) {
      conditions.push(lte(dailyEntries.date, input.endDate));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const entries = await query.orderBy(desc(dailyEntries.date));

    return entries;
  } catch (error) {
    console.error('Failed to fetch daily entries:', error);
    throw new Error('Failed to load daily entries');
  }
}

export async function getDailyEntry(entryId: string) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    const conditions = [eq(dailyEntries.id, entryId)];

    // If not admin, only show entries for user's employees
    if (userResult.user.role !== 'admin') {
      conditions.push(eq(dailyEntries.userId, userResult.user.id!));
    }

    const entry = await db
      .select({
        id: dailyEntries.id,
        employeeId: dailyEntries.employeeId,
        date: dailyEntries.date,
        entryType: dailyEntries.entryType,
        startTime: dailyEntries.startTime,
        endTime: dailyEntries.endTime,
        breakMinutes: dailyEntries.breakMinutes,
        notes: dailyEntries.notes,
        travelCostCents: dailyEntries.travelCostCents,
        isApproved: dailyEntries.isApproved,
        approvedBy: dailyEntries.approvedBy,
        approvedAt: dailyEntries.approvedAt,
        createdAt: dailyEntries.createdAt,
        updatedAt: dailyEntries.updatedAt,
        // Join employee data
        employeeName: employees.name,
        employeeTravelType: employees.travelType,
        employeeDistanceKm: employees.distanceKm,
        employeeEuroPerKm: employees.euroPerKm,
      })
      .from(dailyEntries)
      .leftJoin(employees, eq(dailyEntries.employeeId, employees.id))
      .where(and(...conditions))
      .limit(1);

    if (entry.length === 0) {
      throw new Error('Entry not found');
    }

    return entry[0];
  } catch (error) {
    console.error('Failed to fetch daily entry:', error);
    throw new Error('Failed to load daily entry');
  }
}
