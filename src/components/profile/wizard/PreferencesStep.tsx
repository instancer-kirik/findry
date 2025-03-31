
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PreferencesStepProps {
  onPrevious: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ 
  onPrevious, 
  onComplete, 
  isSubmitting 
}) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Set your notification preferences and privacy settings.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications about new messages and updates.
            </p>
          </div>
          <Switch id="notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="publicProfile">Public profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to everyone.
            </p>
          </div>
          <Switch id="publicProfile" defaultChecked />
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button 
          onClick={onComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;
