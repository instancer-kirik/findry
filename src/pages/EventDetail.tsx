import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Heart, 
  MessageSquare, 
  Star,
  ChevronLeft,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

import MeetingsCard from '../components/meetings/MeetingsCard';
import { EventSlot, Event } from '@/types/event';
import EventSlotManager from '@/components/events/EventSlotManager';
import { artists } from '@/components/discover/DiscoverData';

const eventSlotsMock: EventSlot[] = [
  {
    id: "1",
    title: "Setup",
    description: "Equipment setup and sound check",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
    slotType: "setup",
    notes: "Bring all equipment through the back entrance"
  },
  {
    id: "2",
    title: "DJ Marcus",
    description: "Opening DJ set",
    startTime: "12:00",
    endTime: "14:00",
    status: "confirmed",
    slotType: "performance",
    artistId: "550e8400-e29b-41d4-a716-446655440017",
    notes: "DJ booth and mixer required"
  },
  {
    id: "3",
    title: "Main Stage Performance",
    description: "Headliner act",
    startTime: "15:00",
    endTime: "17:00",
    status: "confirmed",
    slotType: "performance",
    artistId: "550e8400-e29b-41d4-a716-446655440014",
    notes: "Full band setup with special lighting requirements"
  },
  {
    id: "4",
    title: "Break",
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    slotType: "break"
  },
  {
    id: "5",
    title: "Breakdown",
    description: "Equipment breakdown and cleanup",
    startTime: "17:00",
    endTime: "19:00",
    status: "confirmed",
    slotType: "breakdown"
  }
];

const eventMockData: Event = {
  id: '1',
  title: 'Summer Music Festival',
  description: 'Join us for a weekend of amazing music featuring local and international artists. This family-friendly event includes food vendors, art installations, and activities for all ages.',
  longDescription: 'The Summer Music Festival is the highlight of the season, bringing together musical talents from across the globe. Set in the beautiful outdoor amphitheater, this three-day extravaganza features multiple stages, interactive art installations, and a diverse lineup of performers spanning genres from indie rock to electronic, jazz, and world music.\n\nIn addition to the musical performances, attendees can enjoy culinary delights from local food vendors, browse handcrafted goods at the artisan market, and participate in workshops and activities suitable for all ages. The festival grounds open at 11 AM each day, with performances running until 11 PM.\n\nFor families, a dedicated kids\' zone offers face painting, musical instrument crafting, and other fun activities to keep younger attendees engaged and entertained.',
  date: new Date(2023, 6, 15),
  startTime: '12:00',
  endTime: '23:00',
  location: 'Riverfront Park, Austin, TX',
  organizer: 'Austin Music Collective',
  organizerId: '123',
  capacity: '500',
  attendees: 350,
  price: 'Free',
  imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  tags: ['Music', 'Outdoor', 'Festival', 'Family-Friendly'],
  type: 'Festival',
  attending: false,
  interested: true,
  slots: [...eventSlotsMock],
  isPublic: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const relatedMeetingsMock = [
  {
    id: '1',
    title: 'Event Planning Session',
    description: 'Pre-event coordination meeting with all participants',
    date: new Date(2023, 6, 10),
    startTime: '15:00',
    endTime: '16:00',
    meetingType: 'video',
    organizer: { id: '123', name: 'Austin Music Collective', imageUrl: '' },
    participants: [
      { id: '1', name: 'Maria L.', imageUrl: '' },
      { id: '2', name: 'James T.', imageUrl: '' },
      { id: '3', name: 'Sophia R.', imageUrl: '' },
    ],
    isPublic: false,
    meetingLink: 'https://meet.example.com/abc123',
  },
  {
    id: '2',
    title: 'Post-Event Debrief',
    description: 'Review event success and discuss future improvements',
    date: new Date(2023, 6, 18),
    startTime: '14:00',
    endTime: '15:00',
    meetingType: 'in-person',
    organizer: { id: '123', name: 'Austin Music Collective', imageUrl: '' },
    participants: [
      { id: '1', name: 'Maria L.', imageUrl: '' },
      { id: '2', name: 'James T.', imageUrl: '' },
    ],
    isPublic: true,
    location: 'Riverfront Park Office, Austin, TX',
  },
];

const reviewsMockData = [
  {
    id: '1',
    userId: '1',
    userName: 'Maria L.',
    userAvatar: '',
    rating: 5,
    comment: 'Amazing event! The lineup was incredible and the atmosphere was perfect.',
    date: new Date(2022, 6, 18),
  },
  {
    id: '2',
    userId: '2',
    userName: 'James T.',
    userAvatar: '',
    rating: 4,
    comment: 'Great music and food. Would definitely attend again next year.',
    date: new Date(2022, 6, 17),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Sophia R.',
    userAvatar: '',
    rating: 5,
    comment: 'One of the best festivals I\'ve been to. Very well organized.',
    date: new Date(2022, 6, 16),
  },
];

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event>(eventMockData);
  const [isAttending, setIsAttending] = useState(event.attending);
  const [isInterested, setIsInterested] = useState(event.interested);
  const [activeTab, setActiveTab] = useState('details');
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [eventSlots, setEventSlots] = useState<EventSlot[]>(event.slots || []);
  
  useEffect(() => {
    // Fetch artist information for each slot
    const slotsWithInfo = eventSlots.map(slot => {
      if (slot.artistId) {
        const artist = artists.find(a => a.id === slot.artistId);
        if (artist) {
          return { ...slot, artist };
        }
      }
      return slot;
    });
    
    setEvent(prev => ({ ...prev, slots: slotsWithInfo }));
  }, []);
  
  const handleSlotsChange = (newSlots: EventSlot[]) => {
    setEventSlots(newSlots);
    setEvent(prev => ({ ...prev, slots: newSlots }));
  };
  
  const handleAttend = () => {
    setIsAttending(!isAttending);
    
    if (!isAttending) {
      toast.success('You are now attending this event!', {
        description: 'You will receive updates about this event.',
      });
    }
  };
  
  const handleInterest = () => {
    setIsInterested(!isInterested);
    
    if (!isInterested) {
      toast.success('Added to your interested events!', {
        description: 'You will be notified about updates.',
      });
    }
  };
  
  const handleScheduleMeeting = () => {
    toast.success('Meeting request sent!', {
      description: 'The organizer will contact you soon.',
    });
    setShowMeetingDialog(false);
  };
  
  const today = new Date();
  const eventDate = new Date(event.date);
  const daysRemaining = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in-up">
          <div className="mb-6">
            <Link to="/events" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <AnimatedSection animation="fade-in-up" delay={100}>
                <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 p-4 md:p-6">
                      <Badge className="mb-2">{event.type}</Badge>
                      <h1 className="text-2xl md:text-4xl font-bold text-white">{event.title}</h1>
                      <p className="text-white/80 mt-1">{format(event.date, 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in-up" delay={150}>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleAttend} 
                    variant={isAttending ? "default" : "outline"}
                    className="flex-1 md:flex-none"
                  >
                    <Users className="mr-2 h-4 w-4" /> 
                    {isAttending ? 'Attending' : 'Attend'}
                  </Button>
                  
                  <Button 
                    onClick={handleInterest} 
                    variant="outline" 
                    className={`flex-1 md:flex-none ${isInterested ? 'text-rose-500' : ''}`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isInterested ? 'fill-rose-500' : ''}`} /> 
                    {isInterested ? 'Interested' : 'Interest'}
                  </Button>
                  
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  
                  <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 md:flex-none">
                        <Video className="mr-2 h-4 w-4" /> Schedule Meeting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Schedule a Meeting</DialogTitle>
                        <DialogDescription>
                          Connect with the organizer or other attendees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">Meeting Type</label>
                          <select className="border rounded-md p-2">
                            <option value="video">Video Call</option>
                            <option value="in-person">In Person</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">With</label>
                          <select className="border rounded-md p-2">
                            <option value="organizer">Event Organizer</option>
                            <option value="attendees">Other Attendees</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">Message</label>
                          <textarea 
                            className="border rounded-md p-2 min-h-24" 
                            placeholder="Share what you'd like to discuss..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMeetingDialog(false)}>Cancel</Button>
                        <Button onClick={handleScheduleMeeting}>Request Meeting</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in-up" delay={200}>
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attendees">Attendees</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About This Event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{event.longDescription}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Date & Time</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(event.date, 'EEEE, MMMM d, yyyy')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Location</h3>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Capacity</h3>
                              <p className="text-sm text-muted-foreground">
                                {event.attendees} / {event.capacity} attending
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Duration</h3>
                              <p className="text-sm text-muted-foreground">
                                {parseInt(event.endTime) - parseInt(event.startTime)} hours
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="attendees">
                    <Card>
                      <CardHeader>
                        <CardTitle>People Attending</CardTitle>
                        <CardDescription>
                          {event.attendees} people are going to this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((person) => (
                            <div key={person} className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${person + 10}`} />
                                <AvatarFallback>U{person}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">User {person}</p>
                                <p className="text-sm text-muted-foreground">Attending</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View All Attendees</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="meetings">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Event Meetings</CardTitle>
                          <Button size="sm" asChild>
                            <Link to="/meetings/schedule">
                              <Video className="mr-2 h-4 w-4" />
                              Schedule Meeting
                            </Link>
                          </Button>
                        </div>
                        <CardDescription>
                          Meetings related to this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {relatedMeetingsMock.map(meeting => (
                            <div key={meeting.id} className="border-b pb-6 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <Badge className="mb-1">{meeting.meetingType === 'video' ? 'Video Call' : 'In Person'}</Badge>
                                  <h3 className="font-medium">{meeting.title}</h3>
                                </div>
                                {meeting.meetingType === 'video' ? 
                                  <Video className="h-4 w-4 text-primary" /> : 
                                  <Users className="h-4 w-4 text-primary" />
                                }
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">{meeting.description}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>{format(meeting.date, 'PPP')}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>{meeting.startTime} - {meeting.endTime}</span>
                                </div>
                                
                                {meeting.location && (
                                  <div className="flex items-center gap-2 sm:col-span-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{meeting.location}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex -space-x-2">
                                  {meeting.participants.map((participant, i) => (
                                    <Avatar key={i} className="border-2 border-background w-8 h-8">
                                      <AvatarImage src={participant.imageUrl} alt={participant.name} />
                                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                
                                <div className="flex gap-2">
                                  {meeting.meetingType === 'video' && (
                                    <Button size="sm">
                                      <Video className="mr-2 h-4 w-4" />
                                      Join
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/meetings/${meeting.id}`}>Details</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {relatedMeetingsMock.length === 0 && (
                            <div className="text-center py-6">
                              <p className="text-muted-foreground mb-4">No meetings scheduled for this event yet</p>
                              <Button asChild>
                                <Link to="/meetings/schedule">Schedule a Meeting</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reviews</CardTitle>
                        <CardDescription>
                          See what others thought about this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {reviewsMockData.map((review) => (
                            <div key={review.id}>
                              <div className="flex items-start gap-3">
                                <Avatar>
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{review.userName}</p>
                                      <div className="flex text-amber-500 mt-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500' : ''}`} />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {format(review.date, 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                  <p className="mt-2 text-sm">{review.comment}</p>
                                </div>
                              </div>
                              <Separator className="mt-4" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" /> Add Review
                        </Button>
                        <Button variant="outline">View All</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </AnimatedSection>
            </div>
            
            <div className="space-y-6">
              <AnimatedSection animation="fade-in-left" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">
                          {format(event.date, 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Today!'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{event.startTime} - {event.endTime}</p>
                        <p className="text-xs text-muted-foreground">Event time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{event.location}</p>
                        <p className="text-xs text-muted-foreground">Event location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{event.attendees} / {event.capacity}</p>
                        <p className="text-xs text-muted-foreground">People attending</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">Get Tickets: {event.price}</Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in-left" delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{event.organizer}</p>
                        <p className="text-xs text-muted-foreground">Event Organizer</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">Contact Organizer</Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in-left" delay={300}>
                <MeetingsCard 
                  meetings={relatedMeetingsMock} 
                  title="Related Meetings"
                  limit={2}
                />
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About This Event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{event.longDescription}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Date & Time</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(event.date, 'EEEE, MMMM d, yyyy')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Location</h3>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Capacity</h3>
                              <p className="text-sm text-muted-foreground">
                                {event.attendees} / {event.capacity} attending
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Duration</h3>
                              <p className="text-sm text-muted-foreground">
                                {parseInt(event.endTime) - parseInt(event.startTime)} hours
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-6">
            <AnimatedSection animation="fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventSlotManager 
                    slots={event.slots || []}
                    onSlotsChange={handleSlotsChange}
                    eventStartTime={event.startTime}
                    eventEndTime={event.endTime}
                    eventDate={event.date}
                    readOnly={true}
                  />
                </CardContent>
              </Card>
            </AnimatedSection>
          </TabsContent>
          
          <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reviews</CardTitle>
                        <CardDescription>
                          See what others thought about this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {reviewsMockData.map((review) => (
                            <div key={review.id}>
                              <div className="flex items-start gap-3">
                                <Avatar>
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{review.userName}</p>
                                      <div className="flex text-amber-500 mt-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500' : ''}`} />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {format(review.date, 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                  <p className="mt-2 text-sm">{review.comment}</p>
                                </div>
                              </div>
                              <Separator className="mt-4" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" /> Add Review
                        </Button>
                        <Button variant="outline">View All</Button>
                      </CardFooter>
                    </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventDetail;
