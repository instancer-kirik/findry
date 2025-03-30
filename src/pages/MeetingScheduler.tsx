
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users, Video, MessageSquare, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Import data from DiscoverData
import { artists, communities } from '../components/discover/DiscoverData';

// Form schema for meeting creation
const meetingFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  date: z.date({ required_error: 'Meeting date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  meetingType: z.string().min(1, { message: 'Meeting type is required' }),
  participantIds: z.array(z.string()).min(1, { message: 'At least one participant is required' }),
  isPublic: z.boolean().default(false),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

// Mock data for existing meetings
const mockMeetings = [
  {
    id: '1',
    title: 'Collaboration Discussion',
    description: 'Discussing potential collaboration on upcoming exhibition',
    date: new Date(2023, 5, 15),
    startTime: '14:00',
    endTime: '15:00',
    meetingType: 'video',
    organizer: artists[0],
    participants: [artists[1], artists[2]],
    isPublic: false,
    meetingLink: 'https://meet.example.com/abc123',
  },
  {
    id: '2',
    title: 'Community Workshop Planning',
    description: 'Planning session for summer workshop series',
    date: new Date(2023, 5, 18),
    startTime: '10:00',
    endTime: '11:30',
    meetingType: 'in-person',
    organizer: communities[0],
    participants: [artists[0], artists[3], communities[1]],
    isPublic: true,
    location: 'Community Center, 123 Main St',
  },
  {
    id: '3',
    title: 'Project Review',
    description: 'Review progress on collaborative installation',
    date: new Date(2023, 5, 20),
    startTime: '16:00',
    endTime: '17:00',
    meetingType: 'video',
    organizer: artists[2],
    participants: [artists[0], artists[4]],
    isPublic: false,
    meetingLink: 'https://meet.example.com/def456',
  },
];

const MeetingScheduler: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([...artists, ...communities]);
  
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      meetingType: '',
      participantIds: [],
      isPublic: false,
      location: '',
      meetingLink: '',
    },
  });

  // Filter users based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = [...artists, ...communities].filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Add participant to the selected list
  const handleAddParticipant = (participant: any) => {
    if (!selectedParticipants.some(p => p.id === participant.id)) {
      setSelectedParticipants([...selectedParticipants, participant]);
      form.setValue('participantIds', [...selectedParticipants.map(p => p.id), participant.id]);
    }
  };

  // Remove participant from the selected list
  const handleRemoveParticipant = (participantId: string) => {
    const updatedParticipants = selectedParticipants.filter(p => p.id !== participantId);
    setSelectedParticipants(updatedParticipants);
    form.setValue('participantIds', updatedParticipants.map(p => p.id));
  };

  // Handle form submission
  const onSubmit = (data: MeetingFormValues) => {
    console.log('Meeting data:', data);
    console.log('Selected participants:', selectedParticipants);
    
    // In a real app, we would save this to a database
    toast.success('Meeting scheduled successfully!', {
      description: `Your meeting "${data.title}" has been scheduled for ${format(data.date, 'PPP')} at ${data.startTime}.`,
    });
    
    // Reset form and selected participants
    form.reset();
    setSelectedParticipants([]);
    setActiveTab('upcoming');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in-up">
          <h1 className="text-3xl font-bold mb-6">Meeting Scheduler</h1>
        </AnimatedSection>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="past">Past Meetings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Meeting</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Meetings Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMeetings.filter(m => new Date(m.date) >= new Date()).map(meeting => (
                  <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{meeting.meetingType === 'video' ? 'Video Call' : 'In Person'}</Badge>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        </div>
                        {meeting.meetingType === 'video' ? 
                          <Video className="h-5 w-5 text-primary" /> : 
                          <Users className="h-5 w-5 text-primary" />
                        }
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm">{format(meeting.date, 'PPP')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      
                      {meeting.meetingType === 'in-person' && (
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm">{meeting.location}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Participants:</span>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          {meeting.participants.map((participant, i) => (
                            <Avatar key={i} className="border-2 border-background w-8 h-8">
                              <AvatarImage src={participant.imageUrl} alt={participant.name} />
                              <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button variant="outline" size="sm">Details</Button>
                        {meeting.meetingType === 'video' && (
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Join
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {mockMeetings.filter(m => new Date(m.date) >= new Date()).length === 0 && (
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">No upcoming meetings</h3>
                  <p className="text-muted-foreground mb-4">Schedule a meeting to collaborate with other artists</p>
                  <Button onClick={() => setActiveTab('schedule')}>Schedule Meeting</Button>
                </div>
              )}
            </AnimatedSection>
          </TabsContent>
          
          {/* Past Meetings Tab */}
          <TabsContent value="past" className="space-y-6">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMeetings.filter(m => new Date(m.date) < new Date()).map(meeting => (
                  <Card key={meeting.id} className="opacity-80">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="mb-2">{meeting.meetingType === 'video' ? 'Video Call' : 'In Person'}</Badge>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        </div>
                        {meeting.meetingType === 'video' ? 
                          <Video className="h-5 w-5 text-muted-foreground" /> : 
                          <Users className="h-5 w-5 text-muted-foreground" />
                        }
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{format(meeting.date, 'PPP')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <Button variant="outline" size="sm">View Notes</Button>
                        <Button variant="outline" size="sm">Reschedule</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {mockMeetings.filter(m => new Date(m.date) < new Date()).length === 0 && (
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">No past meetings</h3>
                  <p className="text-muted-foreground">Your meeting history will appear here</p>
                </div>
              )}
            </AnimatedSection>
          </TabsContent>
          
          {/* Schedule Meeting Tab */}
          <TabsContent value="schedule">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule a New Meeting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meeting Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter meeting title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="meetingType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meeting Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select meeting type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="video">Video Call</SelectItem>
                                      <SelectItem value="in-person">In Person</SelectItem>
                                      <SelectItem value="phone">Phone Call</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Meeting agenda, topics to discuss, etc." 
                                    className="min-h-24" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Meeting Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Time</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input className="pl-10" type="time" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Time</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input className="pl-10" type="time" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {form.watch('meetingType') === 'in-person' && (
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter meeting location" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Address or venue name where the meeting will take place
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {form.watch('meetingType') === 'video' && (
                            <FormField
                              control={form.control}
                              name="meetingLink"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meeting Link</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter video call link" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Link to the video call platform (Zoom, Google Meet, etc.)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                      checked={field.value}
                                      onChange={field.onChange}
                                    />
                                  </div>
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Public Meeting</FormLabel>
                                  <FormDescription>
                                    Make this meeting visible to all community members
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab('upcoming')}>
                              Cancel
                            </Button>
                            <Button type="submit">Schedule Meeting</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Input 
                          placeholder="Search participants..." 
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-3"
                        />
                      </div>
                      
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {filteredUsers.map(user => (
                          <div 
                            key={user.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => handleAddParticipant(user)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.imageUrl} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.type}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">+</Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Participants:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipants.length > 0 ? (
                            selectedParticipants.map(participant => (
                              <Badge key={participant.id} variant="secondary" className="flex items-center gap-1">
                                {participant.name}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveParticipant(participant.id)} 
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground">No participants selected</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MeetingScheduler;
