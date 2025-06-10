'use server';

import { getAllUsers } from '../queries/get-all-users';
import { updateUserRole } from '../mutations/update-user-role';
import { deleteUser } from '../mutations/delete-user';

export async function getAllUsersAction() {
  try {
    const users = await getAllUsers();
    return { success: true, data: users };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load users' 
    };
  }
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  try {
    const result = await updateUserRole(userId, newRole);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update user role' 
    };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const result = await deleteUser(userId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete user' 
    };
  }
}
