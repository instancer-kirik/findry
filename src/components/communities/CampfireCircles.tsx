import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { 
  Flame, Plus, CalendarIcon, Clock, MapPin, Users, 
  Mic2, MessageCircle, Palette, Coffee, Sparkles 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type CircleType = 'hangout' | 'jam' | 'roundtable' | 'open-mic';

interface CampfireCircle {
  id: string;
  title: string;
  intention: string;
  description: string;
  circleType: CircleType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  maxParticipants: number | null;
  hostName: string;
  hostId: string;
  communityId: string;
  participants: string[];
  createdAt: string;
}

const circleTypeConfig: Record<CircleType, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  'hangout': {
    label: 'Hangout',
    icon: <Coffee className="h-4 w-4" />,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Informal gathering — just vibes, no agenda required'
  },
  'jam': {
    label: 'Jam Session',
    icon: <Palette className="h-4 w-4" />,
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    description: 'Collaborative creation — bring your tools and ideas'
  },
  'roundtable': {
    label: 'Roundtable',
    icon: <MessageCircle className="h-4 w-4" />,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Structured discussion around a topic, with a host guiding'
  },
  'open-mic': {
    label: 'Open Mic',
    icon: <Mic2 className="h-4 w-4" />,
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Rotating spotlight — share your work, get feedback'
  },
};

interface CampfireCirclesProps {
  communityId: string;
}

const CampfireCircles: React.FC<CampfireCirclesProps> = ({ communityId }) => {
  const { user } = useAuth();
  const [circles, setCircles] = useLocalStorage<CampfireCircle[]>(`campfire_circles_${communityId}`, []);
  const [showCreate, setShowCreate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: '',
    intention: '',
    description: '',
    circleType: 'hangout' as CircleType,
    startTime: '',
    endTime: '',
    location: '',
    isVirtual: false,
    maxParticipants: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      intention: '',
      description: '',
      circleType: 'hangout',
      startTime: '',
      endTime: '',
      location: '',
      isVirtual: false,
      maxParticipants: '',
    });
    setDate(undefined);
  };

  const handleCreate = () => {
    if (!user) {
      toast.error('Please sign in to schedule a campfire circle');
      return;
    }
    if (!formData.title || !formData.intention || !date || !formData.startTime) {
      toast.error('Please fill in the title, intention, date, and start time');
      return;
    }

    const newCircle: CampfireCircle = {
      id: uuidv4(),
      title: formData.title,
      intention: formData.intention,
      description: formData.description,
      circleType: formData.circleType,
      date: date.toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.isVirtual ? 'Virtual' : formData.location,
      isVirtual: formData.isVirtual,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      hostName: user.email?.split('@')[0] || 'Host',
      hostId: user.id,
      communityId,
      participants: [user.id],
      createdAt: new Date().toISOString(),
    };

    setCircles((prev) => [newCircle, ...prev]);
    toast.success('Campfire circle scheduled! 🔥');
    setShowCreate(false);
    resetForm();
  };

  const handleJoin = (circleId: string) => {
    if (!user) {
      toast.error('Please sign in to join');
      return;
    }
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        if (c.participants.includes(user.id)) {
          toast.info('You already joined this circle');
          return c;
        }
        if (c.maxParticipants && c.participants.length >= c.maxParticipants) {
          toast.error('This circle is full');
          return c;
        }
        toast.success('Joined the circle!');
        return { ...c, participants: [...c.participants, user.id] };
      })
    );
  };

  const handleLeave = (circleId: string) => {
    if (!user) return;
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        return { ...c, participants: c.participants.filter((p) => p !== user.id) };
      })
    );
    toast.info('Left the circle');
  };

  const upcomingCircles = circles.filter((c) => new Date(c.date) >= new Date());
  const pastCircles = circles.filter((c) => new Date(c.date) < new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Campfire Circles</h2>
            <p className="text-sm text-muted-foreground">
              Gather, create, discuss, or share — set the intention and show up
            </p>
          </div>
        </div>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Circle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Schedule a Campfire Circle
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Circle Type Selection */}
              <div className="space-y-2">
                <Label>What kind of circle?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(circleTypeConfig) as CircleType[]).map((type) => {
                    const config = circleTypeConfig[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, circleType: type })}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border text-left transition-all text-sm",
                          formData.circleType === type
                            ? "ring-2 ring-primary border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <span className={cn("p-1.5 rounded-md border", config.color)}>
                          {config.icon}
                        </span>
                        <div>
                          <div className="font-medium">{config.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{config.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="circle-title">Title</Label>
                <Input
                  id="circle-title"
                  placeholder="e.g. Sunday Evening Beats"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Intention — the key differentiator */}
              <div className="space-y-2">
                <Label htmlFor="circle-intention" className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  Intention
                </Label>
                <Textarea
                  id="circle-intention"
                  placeholder="What's the vibe? What do you hope happens? e.g. 'Explore lo-fi sampling techniques together' or 'Just hang and catch up'"
                  value={formData.intention}
                  onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  The intention sets the tone — it helps people decide if this circle is for them
                </p>
              </div>

              {/* Description (optional) */}
              <div className="space-y-2">
                <Label htmlFor="circle-desc">Details (optional)</Label>
                <Textarea
                  id="circle-desc"
                  placeholder="Any extra context, what to bring, links, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="circle-start">Start Time</Label>
                  <Input
                    id="circle-start"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circle-end">End Time</Label>
                  <Input
                    id="circle-end"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Virtual toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="circle-virtual" className="cursor-pointer">Virtual circle?</Label>
                  <p className="text-xs text-muted-foreground">No physical location needed</p>
                </div>
                <Switch
                  id="circle-virtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked })}
                />
              </div>

              {/* Location (if not virtual) */}
              {!formData.isVirtual && (
                <div className="space-y-2">
                  <Label htmlFor="circle-location">Location</Label>
                  <Input
                    id="circle-location"
                    placeholder="Where are we meeting?"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              )}

              {/* Max participants */}
              <div className="space-y-2">
                <Label htmlFor="circle-max">Max Participants (optional)</Label>
                <Input
                  id="circle-max"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                />
              </div>

              <Button onClick={handleCreate} className="w-full gap-2">
                <Flame className="h-4 w-4" />
                Light the Fire
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Circles */}
      {upcomingCircles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingCircles.map((circle) => {
            const config = circleTypeConfig[circle.circleType];
            const isParticipant = user ? circle.participants.includes(user.id) : false;
            const isHost = user?.id === circle.hostId;
            const isFull = circle.maxParticipants ? circle.participants.length >= circle.maxParticipants : false;

            return (
              <Card key={circle.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("gap-1", config.color)}>
                          {config.icon}
                          {config.label}
                        </Badge>
                        {isHost && <Badge variant="secondary" className="text-xs">Host</Badge>}
                      </div>
                      <CardTitle className="text-lg">{circle.title}</CardTitle>
                    </div>
                    <Flame className="h-5 w-5 text-orange-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  {/* Intention block */}
                  <div className="rounded-md bg-muted/50 p-3 border-l-2 border-orange-400">
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Intention
                    </p>
                    <p className="text-sm">{circle.intention}</p>
                  </div>

                  {circle.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{circle.description}</p>
                  )}

                  <div className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{format(new Date(circle.date), 'EEE, MMM d')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{circle.startTime}{circle.endTime ? ` – ${circle.endTime}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{circle.isVirtual ? '🌐 Virtual' : circle.location || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {circle.participants.length} joined
                        {circle.maxParticipants ? ` / ${circle.maxParticipants} max` : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  {isParticipant ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLeave(circle.id)}
                      disabled={isHost}
                    >
                      {isHost ? 'You\'re hosting' : 'Leave Circle'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleJoin(circle.id)}
                      disabled={isFull}
                    >
                      {isFull ? 'Circle is Full' : 'Join Circle'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-orange-500/10 mb-4">
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No circles scheduled yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Start a campfire circle to bring your community together — set an intention and see who shows up
            </p>
            <Button variant="outline" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule the First Circle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Past Circles */}
      {pastCircles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Past Circles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pastCircles.map((circle) => {
              const config = circleTypeConfig[circle.circleType];
              return (
                <Card key={circle.id} className="opacity-70">
                  <CardHeader className="py-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("gap-1 text-xs", config.color)}>
                          {config.icon}
                          {config.label}
                        </Badge>
                        <span className="text-sm font-medium">{circle.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(circle.date), 'MMM d')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-xs text-muted-foreground italic">"{circle.intention}"</p>
                    <p className="text-xs text-muted-foreground mt-1">{circle.participants.length} attended</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampfireCircles;
