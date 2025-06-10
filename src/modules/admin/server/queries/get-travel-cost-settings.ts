'use server';

import { db } from '@/api/db/connection';
import { travelCostSettings } from '../../schemas/system-settings';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { eq } from 'drizzle-orm';

export async function getTravelCostSettings() {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user || userResult.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  const settings = await db
    .select()
    .from(travelCostSettings)
    .where(eq(travelCostSettings.isActive, true));

  if (!settings.length) {
    return [
      { travelType: 'car', euroCentsPerKm: 21, description: 'Car travel reimbursement' },
      { travelType: 'public', euroCentsPerKm: 0, description: 'Public transport (NS monthly card)' },
      { travelType: 'bike', euroCentsPerKm: 19, description: 'Bicycle travel reimbursement' },
    ];
  }

  return settings;
}
