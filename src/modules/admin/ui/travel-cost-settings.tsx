'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { getTravelCostSettingsAction, updateTravelCostSettingsAction } from '../server/actions/travel-cost-settings-actions';
import { Car, Bus, Bike, Save, Euro } from 'lucide-react';

type TTravelCostSetting = {
  travelType: 'car' | 'public' | 'bike';
  euroCentsPerKm: number;
  description?: string;
};

const travelIcons = {
  car: Car,
  public: Bus,
  bike: Bike,
};

const travelLabels = {
  car: 'Car Travel',
  public: 'Public Transport',
  bike: 'Bicycle Travel',
};

export function TravelCostSettings() {
  const [settings, setSettings] = useState<TTravelCostSetting[]>([
    { travelType: 'car', euroCentsPerKm: 21, description: 'Car travel reimbursement' },
    { travelType: 'public', euroCentsPerKm: 0, description: 'Public transport (NS monthly card)' },
    { travelType: 'bike', euroCentsPerKm: 19, description: 'Bicycle travel reimbursement' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getTravelCostSettingsAction();
        if (result.success) {
          setSettings(result.data);
        } else {
          toast.error(result.error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch travel cost settings:', error);
        toast.error('Failed to load travel cost settings');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  function updateSetting(travelType: 'car' | 'public' | 'bike', field: 'euroCentsPerKm' | 'description', value: number | string) {
    setSettings(prev => prev.map(setting => 
      setting.travelType === travelType 
        ? { ...setting, [field]: value }
        : setting
    ));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await updateTravelCostSettingsAction(settings);
      if (result.success) {
        toast.success('Travel cost settings updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save travel cost settings');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div>Loading travel cost settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Travel Cost Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure reimbursement rates per kilometer for different travel types
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => {
          const Icon = travelIcons[setting.travelType];
          return (
            <div key={setting.travelType} className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <h3 className="font-medium">{travelLabels[setting.travelType]}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <Label htmlFor={`${setting.travelType}-rate`}>Rate (eurocents per km)</Label>
                  <Input
                    id={`${setting.travelType}-rate`}
                    type="number"
                    min="0"
                    value={setting.euroCentsPerKm}
                    onChange={(e) => updateSetting(setting.travelType, 'euroCentsPerKm', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    €{(setting.euroCentsPerKm / 100).toFixed(2)} per kilometer
                  </p>
                </div>
                
                <div>
                  <Label htmlFor={`${setting.travelType}-description`}>Description</Label>
                  <Input
                    id={`${setting.travelType}-description`}
                    value={setting.description || ''}
                    onChange={(e) => updateSetting(setting.travelType, 'description', e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              
              {setting.travelType !== 'bike' && <Separator />}
            </div>
          );
        })}
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
