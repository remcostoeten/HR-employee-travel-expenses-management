'use server';

import { getSession } from '../../helpers/session';
import { userRepository } from '../repositories/user-repository';
import { destroySession } from '../../helpers/session';

export async function deleteAccount() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Delete the user account
    await userRepository().deleteAccount(session.id);
    
    // Destroy the session
    await destroySession();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting account:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete account' 
    };
  }
}