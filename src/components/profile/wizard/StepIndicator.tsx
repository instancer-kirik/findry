
import React from 'react';
import { Check } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onChange?: (index: number) => void;
  stepsCompleted?: Record<string, boolean>;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  onChange,
  stepsCompleted = {} 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center ${index !== 0 ? 'ml-4' : ''}`}
            style={{ flex: 1 }}
            onClick={() => onChange && onChange(index)}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 cursor-pointer
                ${index < currentStep || stepsCompleted[step.id] 
                  ? 'bg-primary text-primary-foreground' 
                  : index === currentStep 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'}`}
            >
              {index < currentStep || stepsCompleted[step.id] ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span 
              className={`text-xs font-medium hidden md:block
                ${index === currentStep 
                  ? 'text-primary' 
                  : index < currentStep || stepsCompleted[step.id]
                    ? 'text-primary/70' 
                    : 'text-muted-foreground'}`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-primary transition-all" 
          style={{ width: `${((currentStep + (stepsCompleted[steps[currentStep]?.id] ? 1 : 0)) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
