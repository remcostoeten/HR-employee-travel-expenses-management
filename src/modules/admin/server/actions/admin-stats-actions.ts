'use server';

import { getAdminStats } from '../queries/get-admin-stats';

export async function getAdminStatsAction() {
  try {
    const stats = await getAdminStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load admin statistics' 
    };
  }
}
