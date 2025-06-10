'use server';

import { getCurrentUser } from '../queries/get-current-user';

export async function getCurrentUserAction() {
  try {
    const result = await getCurrentUser();
    return result;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get current user' 
    };
  }
}
