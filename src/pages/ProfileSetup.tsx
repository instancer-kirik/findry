
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import ProfileWizard from '../components/profile/ProfileWizard';
import { ProfileType } from '../components/auth/ProfileTypeSelector';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const useWizard = searchParams.get('wizard') !== 'false'; // Default to wizard mode
  
  const handleCompleteProfile = () => {
    toast({
      title: "Profile setup complete",
      description: "Your profile has been successfully created.",
    });
    navigate('/profile');
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
            allowMultipleTypes={true} // Enable selection of multiple profile types
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
