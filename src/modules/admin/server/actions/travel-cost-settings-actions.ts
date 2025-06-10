'use server';

import { getTravelCostSettings } from '../queries/get-travel-cost-settings';
import { updateTravelCostSettings } from '../mutations/update-travel-cost-settings';

type TTravelCostSetting = {
  travelType: 'car' | 'public' | 'bike';
  euroCentsPerKm: number;
  description?: string;
};

export async function getTravelCostSettingsAction() {
  try {
    const settings = await getTravelCostSettings();
    return { success: true, data: settings };
  } catch (error) {
    console.error('Failed to fetch travel cost settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load travel cost settings' 
    };
  }
}

export async function updateTravelCostSettingsAction(settings: TTravelCostSetting[]) {
  try {
    const result = await updateTravelCostSettings(settings);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to update travel cost settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save travel cost settings' 
    };
  }
}
