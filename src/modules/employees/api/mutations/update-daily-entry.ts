'use server';

import { db } from '@/api/db/connection';
import { dailyEntries, employees, TEntryType } from '../../schemas';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { eq, and } from 'drizzle-orm';

type TUpdateEntryInput = {
  id: string;
  entryType?: TEntryType;
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  breakMinutes?: number;
  notes?: string;
};

export async function updateDailyEntry(input: TUpdateEntryInput) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    // Get the existing entry and verify ownership
    const conditions = [eq(dailyEntries.id, input.id)];
    
    // If not admin, only allow updating own entries
    if (userResult.user.role !== 'admin') {
      conditions.push(eq(dailyEntries.userId, userResult.user.id!));
    }

    const existingEntry = await db
      .select({
        id: dailyEntries.id,
        employeeId: dailyEntries.employeeId,
        entryType: dailyEntries.entryType,
        travelCostCents: dailyEntries.travelCostCents,
        isApproved: dailyEntries.isApproved,
      })
      .from(dailyEntries)
      .where(and(...conditions))
      .limit(1);

    if (existingEntry.length === 0) {
      throw new Error('Entry not found or access denied');
    }

    const entry = existingEntry[0];

    // Don't allow editing approved entries (unless admin)
    if (entry.isApproved && userResult.user.role !== 'admin') {
      throw new Error('Cannot edit approved entries');
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (input.entryType !== undefined) updateData.entryType = input.entryType;
    if (input.startTime !== undefined) updateData.startTime = input.startTime;
    if (input.endTime !== undefined) updateData.endTime = input.endTime;
    if (input.breakMinutes !== undefined) updateData.breakMinutes = input.breakMinutes;
    if (input.notes !== undefined) updateData.notes = input.notes;

    // Recalculate travel cost if entry type changed
    if (input.entryType !== undefined && input.entryType !== entry.entryType) {
      if (input.entryType === 'office') {
        // Get employee data for travel cost calculation
        const employee = await db
          .select({
            distanceKm: employees.distanceKm,
            euroPerKm: employees.euroPerKm,
            customEuroPerKm: employees.customEuroPerKm,
          })
          .from(employees)
          .where(eq(employees.id, entry.employeeId))
          .limit(1);

        if (employee.length > 0) {
          const effectiveRate = employee[0].customEuroPerKm || employee[0].euroPerKm;
          updateData.travelCostCents = employee[0].distanceKm * effectiveRate;
        }
      } else {
        updateData.travelCostCents = 0;
      }
    }

    // Update the entry
    const updatedEntry = await db
      .update(dailyEntries)
      .set(updateData)
      .where(eq(dailyEntries.id, input.id))
      .returning();

    return { success: true, entry: updatedEntry[0] };
  } catch (error) {
    console.error('Failed to update daily entry:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update daily entry');
  }
}

export async function deleteDailyEntry(entryId: string) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    // Get the existing entry and verify ownership
    const conditions = [eq(dailyEntries.id, entryId)];
    
    // If not admin, only allow deleting own entries
    if (userResult.user.role !== 'admin') {
      conditions.push(eq(dailyEntries.userId, userResult.user.id!));
    }

    const existingEntry = await db
      .select({
        id: dailyEntries.id,
        isApproved: dailyEntries.isApproved,
      })
      .from(dailyEntries)
      .where(and(...conditions))
      .limit(1);

    if (existingEntry.length === 0) {
      throw new Error('Entry not found or access denied');
    }

    // Don't allow deleting approved entries (unless admin)
    if (existingEntry[0].isApproved && userResult.user.role !== 'admin') {
      throw new Error('Cannot delete approved entries');
    }

    // Delete the entry
    await db
      .delete(dailyEntries)
      .where(eq(dailyEntries.id, entryId));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete daily entry:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete daily entry');
  }
}
