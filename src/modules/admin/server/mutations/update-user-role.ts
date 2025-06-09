'use server';

import { db } from '@/api/db/connection';
import { users } from '@/api/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function updateUserRole(userId: string, newRole: string) {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Validate role
  if (!['user', 'admin'].includes(newRole.toLowerCase())) {
    throw new Error('Invalid role');
  }

  const validRole = newRole.toLowerCase() as 'user' | 'admin';

  // Update user role
  await db
    .update(users)
    .set({
      role: validRole,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));

  return { success: true };
}