
import React from 'react';
import { Label } from '@/components/ui/label';

const PreferencesStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Preferences</h3>
      <p className="text-muted-foreground">
        Set your notification preferences and privacy settings.
      </p>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="notifications" className="rounded" />
          <Label htmlFor="notifications">Enable email notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="publicProfile" className="rounded" defaultChecked />
          <Label htmlFor="publicProfile">Make my profile public</Label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
