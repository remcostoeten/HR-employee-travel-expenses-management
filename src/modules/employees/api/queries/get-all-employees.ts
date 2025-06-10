import { db } from '@/api/db/connection';
import { employees } from '../../schemas';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function getAllEmployees() {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  try {
    // Build the base query
    const baseQuery = db
      .select({
        id: employees.id,
        name: employees.name,
        homeAddress: employees.homeAddress,
        travelType: employees.travelType,
        officeDays: employees.officeDays,
        distanceKm: employees.distanceKm,
        euroPerKm: employees.euroPerKm,
        customEuroPerKm: employees.customEuroPerKm,
        customAgreementNotes: employees.customAgreementNotes,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
      })
      .from(employees);

    // If not admin, only show employees created by this user
    const allEmployees = userResult.user.role === 'admin'
      ? await baseQuery.orderBy(desc(employees.createdAt))
      : await baseQuery
          .where(eq(employees.userId, userResult.user.id!))
          .orderBy(desc(employees.createdAt));

    return allEmployees.map(employee => {
      let parsedOfficeDays: string[] = [];
      try {
        parsedOfficeDays = JSON.parse(employee.officeDays) as string[];
      } catch (error) {
        console.error(`Failed to parse officeDays for employee ${employee.id}:`, error);
        // Default to empty array if parsing fails
      }
      
      return {
        ...employee,
        officeDays: parsedOfficeDays,
        monthlyCostCents: employee.distanceKm * employee.euroPerKm * parsedOfficeDays.length,
      };
    });
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    throw new Error('Failed to load employees');
  }
}
