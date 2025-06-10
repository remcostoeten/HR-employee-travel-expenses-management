'use server';

import { getSystemSettings } from '../queries/get-system-settings';
import { updateSystemSettings } from '../mutations/update-system-settings';

type SystemSettingsData = {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
};

export async function getSystemSettingsAction() {
  try {
    const settings = await getSystemSettings();
    return { success: true, data: settings };
  } catch (error) {
    console.error('Failed to fetch system settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load system settings' 
    };
  }
}

export async function updateSystemSettingsAction(settings: SystemSettingsData) {
  try {
    const result = await updateSystemSettings(settings);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to update system settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save system settings' 
    };
  }
}
