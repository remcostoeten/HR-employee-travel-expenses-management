'use server';

import { getEmployeeStats } from '../queries/get-employee-stats';

export async function getEmployeeStatsAction() {
  try {
    const stats = await getEmployeeStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Failed to fetch employee stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load employee stats' 
    };
  }
}
