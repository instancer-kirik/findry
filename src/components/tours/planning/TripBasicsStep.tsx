import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Users, Heart, MapPin, Music, Camera, Coffee, Mountain, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripPlanData, TRIP_INTERESTS } from '@/types/tour-planning';

interface TripBasicsStepProps {
  type: 'band_tour' | 'roadtrip';
  data: Partial<TripPlanData>;
  onUpdate: (data: Partial<TripPlanData>) => void;
}

const TripBasicsStep: React.FC<TripBasicsStepProps> = ({ type, data, onUpdate }) => {
  const handleInterestToggle = (interestId: string) => {
    const currentInterests = data.interests || [];
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];
    onUpdate({ interests: newInterests });
  };

  const getInterestIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      mountain: Mountain,
      music: Music,
      camera: Camera,
      coffee: Coffee,
      heart: Heart,
      star: Sparkles
    };
    const Icon = icons[iconName] || MapPin;
    return <Icon className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Trip Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-semibold">
          {type === 'band_tour' ? '🎸 Tour Name' : '🚗 Trip Name'} *
        </Label>
        <Input
          id="name"
          placeholder={type === 'band_tour' ? 'Summer Rock Tour 2024' : 'Pacific Coast Adventure'}
          value={data.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="text-lg"
        />
        <p className="text-xs text-muted-foreground">Give your {type === 'band_tour' ? 'tour' : 'trip'} an epic name!</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold">
          ✨ What's the vibe?
        </Label>
        <Textarea
          id="description"
          placeholder={type === 'band_tour'
            ? "Describe your tour - the venues, the music, the energy!"
            : "What's this trip about? Adventure, relaxation, discovery?"}
          value={data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold">📅 Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => date && onUpdate({ startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">🏁 End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => date && onUpdate({ endDate: date })}
                disabled={(date) => (data.startDate ? date < data.startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Party Size */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          <Users className="inline h-4 w-4 mr-2" />
          How many adventurers? ({data.partySize || 1})
        </Label>
        <Slider
          value={[data.partySize || 1]}
          onValueChange={(value) => onUpdate({ partySize: value[0] })}
          min={1}
          max={type === 'band_tour' ? 20 : 10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Solo</span>
          <span>{type === 'band_tour' ? 'Full Band' : 'Big Group'}</span>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          💫 What excites you? (Pick your interests)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TRIP_INTERESTS.map((interest) => (
            <Button
              key={interest.id}
              type="button"
              variant={data.interests?.includes(interest.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleInterestToggle(interest.id)}
              className="justify-start"
            >
              {getInterestIcon(interest.icon)}
              <span className="ml-2">{interest.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Public Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="public" className="text-base font-semibold cursor-pointer">
            🌍 Share with the world?
          </Label>
          <p className="text-xs text-muted-foreground">
            Make your {type === 'band_tour' ? 'tour' : 'trip'} visible to others for inspiration
          </p>
        </div>
        <Switch
          id="public"
          checked={data.isPublic || false}
          onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
        />
      </div>

      {/* Fun stats preview */}
      {data.startDate && data.endDate && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">📊 Quick Stats:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>{' '}
              <span className="font-medium">
                {Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Party Size:</span>{' '}
              <span className="font-medium">{data.partySize || 1} {(data.partySize || 1) === 1 ? 'person' : 'people'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripBasicsStep;
