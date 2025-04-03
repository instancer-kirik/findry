
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface StepProps {
  step: WizardStep;
  isLastStep: boolean;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  stepProps: any;
}

export const ProfileWizardSteps: React.FC<StepProps> = ({
  step,
  isLastStep,
  onNext,
  onBack,
  isFirstStep,
  stepProps,
}) => {
  const StepComponent = step.component;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
          <StepComponent {...stepProps} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep}
          type="button"
        >
          Back
        </Button>
        <Button onClick={onNext} type="button">
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};
