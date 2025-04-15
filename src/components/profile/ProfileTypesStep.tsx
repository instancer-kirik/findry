import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { validateProfileTypes, PROFILE_TYPE_OPTIONS } from '@/types/profile';

interface ProfileTypesStepProps {
  selectedTypes: string[];
  onSelect: (types: string[]) => void;
  onComplete: () => void;
}

export const ProfileTypesStep: React.FC<ProfileTypesStepProps> = ({
  selectedTypes,
  onSelect,
  onComplete,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];

    if (!validateProfileTypes(newTypes)) {
      setError('Invalid profile type selected');
      return;
    }

    setError(null);
    onSelect(newTypes);
  };

  const handleComplete = () => {
    if (selectedTypes.length === 0) {
      setError('Please select at least one profile type');
      return;
    }

    if (!validateProfileTypes(selectedTypes)) {
      setError('Invalid profile types selected');
      return;
    }

    setError(null);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROFILE_TYPE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedTypes.includes(option.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleTypeSelect(option.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-primary">{option.icon}</div>
              <div>
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          disabled={selectedTypes.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}; 