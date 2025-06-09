'use server';

import { db } from '@/api/db/connection';
import { users } from '@/api/db/schema';
import { desc } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function getAllUsers() {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Get all users, ordered by creation date (newest first)
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return allUsers;
}