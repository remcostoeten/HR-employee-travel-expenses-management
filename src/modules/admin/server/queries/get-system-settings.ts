'use server';

import { db } from '@/api/db/connection';
import { systemSettings } from '@/api/db/schema';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function getSystemSettings() {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Try to get existing settings
  const settings = await db
    .select()
    .from(systemSettings)
    .limit(1);

  // If no settings exist yet, return defaults
  if (!settings.length) {
    return {
      siteName: 'Notr',
      siteDescription: 'Note taking, without the fluff',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true
    };
  }

  return settings[0];
}