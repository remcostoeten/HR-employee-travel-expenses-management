'use server';

import { db } from '@/api/db/connection';
import { dailyEntries, employees, TEntryType } from '../../schemas';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { eq, and } from 'drizzle-orm';

type TCreateEntryInput = {
  employeeId: string;
  date: string; // YYYY-MM-DD
  entryType: TEntryType;
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  breakMinutes?: number;
  notes?: string;
};

export async function createDailyEntry(input: TCreateEntryInput) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    // Verify the employee belongs to the user (unless admin)
    if (userResult.user.role !== 'admin') {
      const employee = await db
        .select({ id: employees.id })
        .from(employees)
        .where(and(
          eq(employees.id, input.employeeId),
          eq(employees.userId, userResult.user.id!)
        ))
        .limit(1);

      if (employee.length === 0) {
        throw new Error('Employee not found or access denied');
      }
    }

    // Check if entry already exists for this date
    const existingEntry = await db
      .select({ id: dailyEntries.id })
      .from(dailyEntries)
      .where(and(
        eq(dailyEntries.employeeId, input.employeeId),
        eq(dailyEntries.date, input.date)
      ))
      .limit(1);

    if (existingEntry.length > 0) {
      throw new Error('Entry already exists for this date');
    }

    // Get employee data for travel cost calculation
    const employee = await db
      .select({
        distanceKm: employees.distanceKm,
        euroPerKm: employees.euroPerKm,
        customEuroPerKm: employees.customEuroPerKm,
      })
      .from(employees)
      .where(eq(employees.id, input.employeeId))
      .limit(1);

    if (employee.length === 0) {
      throw new Error('Employee not found');
    }

    // Calculate travel cost for office days
    let travelCostCents = 0;
    if (input.entryType === 'office') {
      const effectiveRate = employee[0].customEuroPerKm || employee[0].euroPerKm;
      travelCostCents = employee[0].distanceKm * effectiveRate;
    }

    // Create the entry
    const newEntry = await db
      .insert(dailyEntries)
      .values({
        employeeId: input.employeeId,
        userId: userResult.user.id!,
        date: input.date,
        entryType: input.entryType,
        startTime: input.startTime,
        endTime: input.endTime,
        breakMinutes: input.breakMinutes || 0,
        notes: input.notes,
        travelCostCents,
        isApproved: false, // Default to not approved
      })
      .returning();

    return { success: true, entry: newEntry[0] };
  } catch (error) {
    console.error('Failed to create daily entry:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create daily entry');
  }
}
