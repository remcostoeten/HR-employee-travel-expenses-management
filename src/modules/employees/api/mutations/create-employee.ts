'use server';
import { db } from '@/api/db/connection';
import { TTravelType, employees } from '../../schemas';
import { calculateDistance } from '../../utilities/calculate-distance';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

type TInput = {
  name: string;
  homeAddress: string;
  travelType: TTravelType;
  officeDays: string[];
};

export async function createEmployee(input: TInput) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  const officeAddress = process.env.OFFICE_ADDRESS!;
  if (!officeAddress) throw new Error('No OFFICE_ADDRESS in env');

  const distanceKm = await calculateDistance(input.homeAddress, officeAddress);
  const euroPerKm = 21;
  const costCents = Math.round(distanceKm * euroPerKm * input.officeDays.length);

  await db.insert(employees).values({
    userId: userResult.user.id!,
    name: input.name,
    homeAddress: input.homeAddress,
    travelType: input.travelType,
    officeDays: JSON.stringify(input.officeDays),
    distanceKm: Math.round(distanceKm),
    euroPerKm,
  });

  return { success: true, distanceKm, costCents };
}
