'use server';

import { getDailyEntries, getDailyEntry } from '../queries/get-daily-entries';
import { createDailyEntry } from '../mutations/create-daily-entry';
import { updateDailyEntry, deleteDailyEntry } from '../mutations/update-daily-entry';
import { TEntryType } from '../../schemas';

type TGetEntriesInput = {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
};

type TCreateEntryInput = {
  employeeId: string;
  date: string;
  entryType: TEntryType;
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
};

type TUpdateEntryInput = {
  id: string;
  entryType?: TEntryType;
  startTime?: string | undefined;
  endTime?: string | undefined;
  breakMinutes?: number;
  notes?: string | undefined;
};

export async function getDailyEntriesAction(input: TGetEntriesInput = {}) {
  try {
    const entries = await getDailyEntries(input);
    return { success: true, data: entries };
  } catch (error) {
    console.error('Failed to fetch daily entries:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load daily entries' 
    };
  }
}

export async function getDailyEntryAction(entryId: string) {
  try {
    const entry = await getDailyEntry(entryId);
    return { success: true, data: entry };
  } catch (error) {
    console.error('Failed to fetch daily entry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load daily entry' 
    };
  }
}

export async function createDailyEntryAction(input: TCreateEntryInput) {
  try {
    const result = await createDailyEntry(input);
    return { success: true, data: result.entry };
  } catch (error) {
    console.error('Failed to create daily entry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create daily entry' 
    };
  }
}

export async function updateDailyEntryAction(input: TUpdateEntryInput) {
  try {
    const result = await updateDailyEntry(input);
    return { success: true, data: result.entry };
  } catch (error) {
    console.error('Failed to update daily entry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update daily entry' 
    };
  }
}

export async function deleteDailyEntryAction(entryId: string) {
  try {
    await deleteDailyEntry(entryId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete daily entry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete daily entry' 
    };
  }
}
