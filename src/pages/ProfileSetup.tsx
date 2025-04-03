
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import ProfileWizard from '../components/profile/ProfileWizard';
import { ProfileFormValues } from '@/types/profile';
import { useProfile } from '@/hooks/use-profile';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { updateProfile } = useProfile();
  
  const handleCompleteProfile = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        username: values.username,
        full_name: values.full_name,
        avatar_url: values.avatar_url,
        bio: values.bio,
        profile_types: values.profile_types,
        role_attributes: values.role_attributes
      });
      
      toast({
        title: "Profile setup complete",
        description: "Your profile has been successfully created.",
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          </div>
          
          <ProfileWizard 
            onComplete={handleCompleteProfile}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
