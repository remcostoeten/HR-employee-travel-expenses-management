'use server';

import { db } from '@/api/db/connection';
import { systemSettings } from '@/api/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

type SystemSettingsData = {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
};

export async function updateSystemSettings(settings: SystemSettingsData) {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Check if settings already exist
  const existingSettings = await db
    .select({ id: systemSettings.id })
    .from(systemSettings)
    .limit(1);

  if (existingSettings.length) {
    // Update existing settings
    await db
      .update(systemSettings)
      .set({
        ...settings,
        updatedAt: new Date()
      })
      .where(eq(systemSettings.id, existingSettings[0].id));
  } else {
    // Create new settings
    await db
      .insert(systemSettings)
      .values({
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  }

  return { success: true };
}