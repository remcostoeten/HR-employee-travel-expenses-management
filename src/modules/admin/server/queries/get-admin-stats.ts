'use server';

import { db } from '@/api/db/connection';
import { users, sessions } from '@/api/db/schema';
import { gte, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/get-current-user';

export async function getAdminStats() {
  // Check if current user is admin
  const result = await getCurrentUser();
  if (!result.success || !result.user || result.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  // Get total users count
  const totalUsersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);
  const totalUsers = totalUsersResult[0]?.count || 0;

  // Get new users today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newUsersTodayResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(gte(users.createdAt, today));
  const newUsersToday = newUsersTodayResult[0]?.count || 0;

  // Get active users in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activeUsersResult = await db
    .select({ count: sql<number>`count(distinct ${sessions.userId})` })
    .from(sessions)
    .where(gte(sessions.updatedAt, sevenDaysAgo));
  const activeUsers = activeUsersResult[0]?.count || 0;

  // For average session time, we'll return a placeholder
  // In a real app, you'd calculate this from session data
  const averageSessionTime = "12m 30s";

  return {
    totalUsers,
    newUsersToday,
    activeUsers,
    averageSessionTime
  };
}