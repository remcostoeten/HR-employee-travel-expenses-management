'use server';
import { db } from '@/api/db/connection';
import { employees } from '../../schemas';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function deleteEmployee(employeeId: string) {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    throw new Error('User not authenticated');
  }

  // Only admins can delete employees
  if (userResult.user.role !== 'admin') {
    throw new Error('Unauthorized: Only administrators can delete employees');
  }

  const result = await db
    .delete(employees)
    .where(eq(employees.id, employeeId))
    .returning();

  if (result.length === 0) {
    throw new Error('Employee not found');
  }

  return { success: true };
}
