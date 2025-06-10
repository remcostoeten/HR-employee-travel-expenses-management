'use server';
import { db } from '@/api/db/connection';
import { TTravelType, employees } from '../../schemas';
import { calculateDistance } from '../../utilities/calculate-distance';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';
import { travelCostSettings } from '@/modules/admin/schemas/system-settings';
import { eq } from 'drizzle-orm';

type TInput = {
  name: string;
  homeAddress: string;
  travelType: TTravelType;
  officeDays: string[];
  customEuroPerKm?: number;
  customAgreementNotes?: string;
};

export async function createEmployee(input: TInput) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  // Only admins can create employees
  if (userResult.user.role !== 'admin') {
    throw new Error('Unauthorized: Only administrators can create employees');
  }

  const officeAddress = process.env.OFFICE_ADDRESS!;
  if (!officeAddress) throw new Error('No OFFICE_ADDRESS in env');

  const distanceKm = await calculateDistance(input.homeAddress, officeAddress);

  let euroPerKm = 21;

  if (input.customEuroPerKm) {
    euroPerKm = input.customEuroPerKm;
  } else {
    try {
      const costSetting = await db
        .select()
        .from(travelCostSettings)
        .where(eq(travelCostSettings.travelType, input.travelType))
        .limit(1);

      if (costSetting.length > 0) {
        euroPerKm = costSetting[0].euroCentsPerKm;
      }
    } catch (error) {
      console.warn('Failed to fetch travel cost settings, using default rate:', error);
    }
  }

  const costCents = Math.round(distanceKm * euroPerKm * input.officeDays.length);

  await db.insert(employees).values({
    userId: userResult.user.id!,
    name: input.name,
    homeAddress: input.homeAddress,
    travelType: input.travelType,
    officeDays: JSON.stringify(input.officeDays),
    distanceKm: Math.round(distanceKm),
    euroPerKm,
    customEuroPerKm: input.customEuroPerKm,
    customAgreementNotes: input.customAgreementNotes,
  });

  return { success: true, distanceKm, costCents };
}
