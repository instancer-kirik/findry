
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import StepIndicator from './wizard/StepIndicator';
import ProfileWizardSteps from './wizard/ProfileWizardSteps';
import { useProfileWizard } from '@/hooks/useProfileWizard';

interface ProfileWizardProps {
  onComplete?: () => void;
  allowMultipleTypes?: boolean;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({ 
  onComplete, 
  allowMultipleTypes = false 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    currentStep,
    steps,
    stepsCompleted,
    selectedProfileTypes,
    profileData,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleProfileDataChange,
    handleRoleAttributeChange,
    handleSubmit,
    setSelectedProfileTypes
  } = useProfileWizard(onComplete);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedSection animation="fade-in-up">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          stepsCompleted={stepsCompleted} 
        />

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <ProfileWizardSteps
              currentStep={currentStep}
              selectedProfileTypes={selectedProfileTypes}
              setSelectedProfileTypes={setSelectedProfileTypes}
              profileData={profileData}
              handleProfileDataChange={handleProfileDataChange}
              handleRoleAttributeChange={handleRoleAttributeChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default ProfileWizard;
