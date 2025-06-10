'use server';

import { getAllEmployees } from '../queries/get-all-employees';

export async function getEmployeesAction() {
  try {
    const employees = await getAllEmployees();
    return { success: true, data: employees };
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load employees' 
    };
  }
}
