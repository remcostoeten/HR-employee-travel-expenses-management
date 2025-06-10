'use server';

import { db } from '@/api/db/connection';
import { travelCostSettings } from '../../schemas/system-settings';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { eq } from 'drizzle-orm';

type TTravelCostSetting = {
  travelType: 'car' | 'public' | 'bike';
  euroCentsPerKm: number;
  description?: string;
};

export async function updateTravelCostSettings(settings: TTravelCostSetting[]) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user || userResult.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  try {
    for (const setting of settings) {
      const existing = await db
        .select()
        .from(travelCostSettings)
        .where(eq(travelCostSettings.travelType, setting.travelType))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(travelCostSettings)
          .set({
            euroCentsPerKm: setting.euroCentsPerKm,
            description: setting.description,
            updatedAt: new Date(),
          })
          .where(eq(travelCostSettings.travelType, setting.travelType));
      } else {
        await db
          .insert(travelCostSettings)
          .values({
            travelType: setting.travelType,
            euroCentsPerKm: setting.euroCentsPerKm,
            description: setting.description,
            isActive: true,
          });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update travel cost settings:', error);
    throw new Error('Failed to update travel cost settings');
  }
}
