'use server';

import { db } from '@/api/db/connection';
import { users, sessions } from '@/api/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function deleteUser(userId: string) {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Prevent deleting yourself
  if (result.user.id === userId) {
    throw new Error('You cannot delete your own account');
  }

  // Delete user's sessions first (foreign key constraint)
  await db
    .delete(sessions)
    .where(eq(sessions.userId, userId));

  // Delete the user
  await db
    .delete(users)
    .where(eq(users.id, userId));

  return { success: true };
}