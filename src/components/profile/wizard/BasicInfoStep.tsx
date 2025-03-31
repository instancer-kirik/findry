
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
}

interface BasicInfoStepProps {
  profileData: ProfileData;
  handleProfileDataChange: (field: string, value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  profileData, 
  handleProfileDataChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName"
            className="w-full"
            value={profileData.displayName}
            onChange={(e) => handleProfileDataChange('displayName', e.target.value)}
            placeholder="Your name or artist name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location"
            className="w-full"
            value={profileData.location}
            onChange={(e) => handleProfileDataChange('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio"
          className="w-full min-h-32"
          value={profileData.bio}
          onChange={(e) => handleProfileDataChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input 
          id="website"
          className="w-full"
          value={profileData.website}
          onChange={(e) => handleProfileDataChange('website', e.target.value)}
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
