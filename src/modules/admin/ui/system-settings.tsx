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
  Switch,
  Separator,
  Skeleton
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { getSystemSettingsAction, updateSystemSettingsAction } from '../server/actions/system-settings-actions';
import { Settings, Save } from 'lucide-react';

type SystemSettingsData = {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
};

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsData>({
    siteName: '',
    siteDescription: '',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getSystemSettingsAction();
        if (result.success) {
          setSettings(result.data);
        } else {
          toast.error(result.error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load system settings');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const result = await updateSystemSettingsAction(settings);
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" /> System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-[140px]" /> {/* Section title */}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80px]" /> {/* Site Name label */}
                <Skeleton className="h-10 w-full" /> {/* Site Name input */}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" /> {/* Site Description label */}
                <Skeleton className="h-10 w-full" /> {/* Site Description input */}
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full" /> {/* Separator */}

          {/* System Configuration Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-[180px]" /> {/* Section title */}

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[140px]" /> {/* Setting label */}
                    <Skeleton className="h-3 w-[280px]" /> {/* Setting description */}
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch */}
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-[120px] rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings className="h-5 w-5" /> System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">System Configuration</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the site will show a maintenance page to all non-admin users
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowRegistration">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    When disabled, new users cannot register on the site
                  </p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, new users must verify their email before accessing the site
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}