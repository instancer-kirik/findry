
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addHours, parse } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Layout from '@/components/layout/Layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, CalendarDays, Video, MapPin } from 'lucide-react';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import MeetingsCard from '@/components/meetings/MeetingsCard';
import { toast } from 'sonner';

// Sample data for meetings
const sampleMeetings = [
  {
    id: '1',
    title: 'Album Review Session',
    description: 'Review the final mixes for the upcoming album release.',
    date: new Date(2023, 6, 15),
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'video',
    organizer: {
      name: 'Alex Kim',
      avatar: '/placeholder.svg'
    },
    participants: [
      { name: 'Taylor Swift', avatar: '/placeholder.svg' },
      { name: 'John Doe', avatar: '/placeholder.svg' },
      { name: 'Elena Rivera', avatar: '/placeholder.svg' }
    ],
    isPublic: false,
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Venue Walkthrough',
    description: 'Meet at The Acoustic Lounge to discuss upcoming performance and check stage setup.',
    date: new Date(2023, 6, 20),
    startTime: '10:00',
    endTime: '11:00',
    meetingType: 'in-person',
    organizer: {
      name: 'Studio 54',
      avatar: '/placeholder.svg'
    },
    participants: [
      { name: 'Alex Kim', avatar: '/placeholder.svg' },
      { name: 'Bass Betty', avatar: '/placeholder.svg' }
    ],
    isPublic: true,
    location: 'The Acoustic Lounge, 123 Music Street'
  },
  {
    id: '3',
    title: 'Collaboration Planning',
    description: 'Discuss potential collaboration on the new track.',
    date: new Date(2023, 7, 5),
    startTime: '16:00',
    endTime: '17:00',
    meetingType: 'video',
    organizer: {
      name: 'James Bond',
      avatar: '/placeholder.svg'
    },
    participants: [
      { name: 'Alex Kim', avatar: '/placeholder.svg' },
      { name: 'Guitar George', avatar: '/placeholder.svg' },
      { name: 'Mike Drums', avatar: '/placeholder.svg' }
    ],
    isPublic: false,
    meetingLink: 'https://zoom.us/j/123456789'
  }
];

// Sample people/venues data for meeting creation
const samplePeople = [
  { id: '1', name: 'Taylor Swift', type: 'artist', avatar: '/placeholder.svg' },
  { id: '2', name: 'John Doe', type: 'producer', avatar: '/placeholder.svg' },
  { id: '3', name: 'Elena Rivera', type: 'artist', avatar: '/placeholder.svg' },
  { id: '4', name: 'Mike Drums', type: 'artist', avatar: '/placeholder.svg' },
  { id: '5', name: 'Bass Betty', type: 'artist', avatar: '/placeholder.svg' },
  { id: '6', name: 'Guitar George', type: 'artist', avatar: '/placeholder.svg' },
  { id: '7', name: 'Studio 54', type: 'venue', avatar: '/placeholder.svg' },
  { id: '8', name: 'The Acoustic Lounge', type: 'venue', avatar: '/placeholder.svg' },
  { id: '9', name: 'Electric Factory', type: 'venue', avatar: '/placeholder.svg' },
  { id: '10', name: 'Summit Theater', type: 'venue', avatar: '/placeholder.svg' },
];

interface Person {
  id: string;
  name: string;
  type: string;
  avatar: string;
}

const MeetingScheduler: React.FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(meetingId ? 'view' : 'upcoming');
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    meetingType: 'video',
    isPublic: false,
    meetingLink: '',
    location: '',
  });
  
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter people based on search query
  const filteredPeople = samplePeople.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get meeting details if viewing a specific meeting
  const currentMeeting = meetingId ? sampleMeetings.find(m => m.id === meetingId) : null;
  
  useEffect(() => {
    if (meetingId && !currentMeeting) {
      // Meeting not found, redirect to upcoming meetings
      navigate('/meetings');
    }
    
    if (currentMeeting) {
      setActiveTab('view');
    }
  }, [meetingId, currentMeeting, navigate]);
  
  const handleCreateMeeting = () => {
    // Here you would normally send this to your API
    console.log('Creating meeting:', {
      ...meetingForm,
      participants: selectedParticipants.map(id => 
        samplePeople.find(person => person.id === id)
      )
    });
    
    toast.success('Meeting scheduled successfully!');
    setActiveTab('upcoming');
    
    // Clear the form
    setMeetingForm({
      title: '',
      description: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      meetingType: 'video',
      isPublic: false,
      meetingLink: '',
      location: '',
    });
    setSelectedParticipants([]);
  };
  
  const handleParticipantToggle = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) 
        ? prev.filter(pId => pId !== id) 
        : [...prev, id]
    );
  };
  
  const handleJoinMeeting = () => {
    if (currentMeeting?.meetingLink) {
      window.open(currentMeeting.meetingLink, '_blank');
    } else {
      toast.error('No meeting link available');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Meetings & Calendar</h1>
                  <p className="text-muted-foreground">Schedule and manage your meetings</p>
                </div>
                
                <TabsList className="mt-4 sm:mt-0">
                  <TabsTrigger value="upcoming" className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule
                  </TabsTrigger>
                  {meetingId && (
                    <TabsTrigger value="view" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      View
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              
              <TabsContent value="upcoming" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Calendar</CardTitle>
                    <CardDescription>
                      View and manage your upcoming meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                      <div className="md:col-span-3 p-6">
                        <Calendar
                          mode="single"
                          selected={new Date()}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="md:col-span-4 border-t md:border-t-0 md:border-l">
                        <div className="p-6">
                          <h3 className="font-medium mb-4">Today's Meetings</h3>
                          <div className="space-y-4">
                            {sampleMeetings.slice(0, 2).map((meeting) => (
                              <div key={meeting.id} className="flex items-start gap-3 p-3 rounded-md border">
                                <div className="mt-1">
                                  {meeting.meetingType === 'video' ? (
                                    <Video className="h-5 w-5 text-primary" />
                                  ) : (
                                    <MapPin className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{meeting.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {meeting.startTime} - {meeting.endTime}
                                  </p>
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex -space-x-2">
                                      {meeting.participants.slice(0, 3).map((participant, i) => (
                                        <Avatar key={i} className="border-2 border-background w-6 h-6">
                                          <AvatarImage src={participant.avatar} alt={participant.name} />
                                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                        </Avatar>
                                      ))}
                                    </div>
                                    {meeting.participants.length > 3 && (
                                      <span className="text-xs text-muted-foreground ml-1">
                                        +{meeting.participants.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/meetings/${meeting.id}`}>
                                    Details
                                  </Link>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => setActiveTab('schedule')}>
                      Schedule a meeting
                    </Button>
                  </CardFooter>
                </Card>
                
                <MeetingsCard meetings={sampleMeetings} title="All Upcoming Meetings" showAll={true} />
              </TabsContent>
              
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule a Meeting</CardTitle>
                    <CardDescription>
                      Set up a new meeting with artists, venues, or other members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Meeting Title</Label>
                          <Input 
                            id="title" 
                            placeholder="Enter meeting title" 
                            value={meetingForm.title}
                            onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description" 
                            placeholder="What's this meeting about?" 
                            rows={3}
                            value={meetingForm.description}
                            onChange={(e) => setMeetingForm({...meetingForm, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Meeting Type</Label>
                          <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="radio" 
                                id="video" 
                                name="meetingType" 
                                value="video"
                                checked={meetingForm.meetingType === 'video'}
                                onChange={() => setMeetingForm({
                                  ...meetingForm, 
                                  meetingType: 'video',
                                  location: ''
                                })}
                                className="text-primary focus:ring-primary"
                              />
                              <Label htmlFor="video" className="cursor-pointer flex items-center">
                                <Video className="mr-1 h-4 w-4" />
                                Video Call
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input 
                                type="radio" 
                                id="in-person" 
                                name="meetingType" 
                                value="in-person"
                                checked={meetingForm.meetingType === 'in-person'}
                                onChange={() => setMeetingForm({
                                  ...meetingForm, 
                                  meetingType: 'in-person',
                                  meetingLink: ''
                                })}
                                className="text-primary focus:ring-primary"
                              />
                              <Label htmlFor="in-person" className="cursor-pointer flex items-center">
                                <MapPin className="mr-1 h-4 w-4" />
                                In Person
                              </Label>
                            </div>
                          </div>
                        </div>
                        
                        {meetingForm.meetingType === 'video' ? (
                          <div className="space-y-2">
                            <Label htmlFor="meetingLink">Meeting Link</Label>
                            <Input 
                              id="meetingLink" 
                              placeholder="Paste your meeting link here" 
                              value={meetingForm.meetingLink}
                              onChange={(e) => setMeetingForm({...meetingForm, meetingLink: e.target.value})}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              placeholder="Enter meeting location" 
                              value={meetingForm.location}
                              onChange={(e) => setMeetingForm({...meetingForm, location: e.target.value})}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox 
                            id="isPublic"
                            checked={meetingForm.isPublic}
                            onCheckedChange={(checked) => 
                              setMeetingForm({...meetingForm, isPublic: checked as boolean})
                            }
                          />
                          <label
                            htmlFor="isPublic"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Make this meeting public (visible to all community members)
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Date & Time</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Calendar
                                mode="single"
                                selected={meetingForm.date}
                                onSelect={(date) => date && setMeetingForm({...meetingForm, date})}
                                className="rounded-md border"
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Select 
                                  value={meetingForm.startTime}
                                  onValueChange={(value) => setMeetingForm({...meetingForm, startTime: value})}
                                >
                                  <SelectTrigger id="startTime">
                                    <SelectValue placeholder="Select start time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 24}, (_, i) => i).map((hour) => (
                                      <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                        {`${hour.toString().padStart(2, '0')}:00`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Select 
                                  value={meetingForm.endTime}
                                  onValueChange={(value) => setMeetingForm({...meetingForm, endTime: value})}
                                >
                                  <SelectTrigger id="endTime">
                                    <SelectValue placeholder="Select end time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 24}, (_, i) => i).map((hour) => (
                                      <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                        {`${hour.toString().padStart(2, '0')}:00`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <Label className="flex justify-between items-center">
                            <span>Participants</span>
                            <Badge variant="outline">{selectedParticipants.length} selected</Badge>
                          </Label>
                          <Input 
                            placeholder="Search people or venues" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-2"
                          />
                          <ScrollArea className="h-[200px] rounded-md border p-2">
                            <div className="space-y-2">
                              {filteredPeople.map((person) => (
                                <div 
                                  key={person.id} 
                                  className={`flex items-center justify-between p-2 rounded-md ${
                                    selectedParticipants.includes(person.id) 
                                      ? 'bg-primary/10' 
                                      : 'hover:bg-secondary/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={person.avatar} alt={person.name} />
                                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{person.name}</p>
                                      <p className="text-xs text-muted-foreground capitalize">{person.type}</p>
                                    </div>
                                  </div>
                                  <Checkbox 
                                    checked={selectedParticipants.includes(person.id)}
                                    onCheckedChange={() => handleParticipantToggle(person.id)}
                                  />
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('upcoming')}>Cancel</Button>
                    <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {currentMeeting && (
                <TabsContent value="view">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{currentMeeting.title}</CardTitle>
                          <CardDescription>
                            {format(currentMeeting.date, 'EEEE, MMMM d, yyyy')} • {currentMeeting.startTime} - {currentMeeting.endTime}
                          </CardDescription>
                        </div>
                        <Badge variant={currentMeeting.meetingType === 'video' ? 'default' : 'secondary'}>
                          {currentMeeting.meetingType === 'video' ? 'Video Call' : 'In Person'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Description</h3>
                        <p className="text-sm text-muted-foreground">{currentMeeting.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-md">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm">Time</p>
                              <p className="text-sm font-medium">
                                {currentMeeting.startTime} - {currentMeeting.endTime}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-md">
                              {currentMeeting.meetingType === 'video' ? (
                                <Video className="h-4 w-4 text-primary" />
                              ) : (
                                <MapPin className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm">{currentMeeting.meetingType === 'video' ? 'Meeting Link' : 'Location'}</p>
                              <p className="text-sm font-medium">
                                {currentMeeting.meetingType === 'video' 
                                  ? currentMeeting.meetingLink 
                                  : currentMeeting.location
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Participants ({currentMeeting.participants.length + 1})</h3>
                          <Badge variant="outline" className={currentMeeting.isPublic ? 'bg-green-50' : 'bg-yellow-50'}>
                            {currentMeeting.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center gap-2 border rounded-md p-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={currentMeeting.organizer.avatar} alt={currentMeeting.organizer.name} />
                              <AvatarFallback>{currentMeeting.organizer.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{currentMeeting.organizer.name}</p>
                              <p className="text-xs text-muted-foreground">Organizer</p>
                            </div>
                          </div>
                          
                          {currentMeeting.participants.map((participant, index) => (
                            <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.avatar} alt={participant.name} />
                                <AvatarFallback>{participant.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{participant.name}</p>
                                <p className="text-xs text-muted-foreground">Participant</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to="/meetings">
                          Back to All Meetings
                        </Link>
                      </Button>
                      {currentMeeting.meetingType === 'video' && (
                        <Button onClick={handleJoinMeeting}>
                          Join Meeting
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div className="md:w-1/4 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('schedule')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/events/create">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <MeetingsCard meetings={sampleMeetings} limit={2} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MeetingScheduler;
