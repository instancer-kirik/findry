
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Users, Share2, Bookmark, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AnimatedSection from '../components/ui-custom/AnimatedSection';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, we would fetch event data from an API
  // For demo purposes, we'll use mock data
  const event = {
    id: id || '1',
    title: 'Summer Music Festival',
    description: 'Join us for three days of amazing live music featuring local and international artists. This outdoor event will include food trucks, art installations, and activities for all ages. Bring your friends and family for an unforgettable weekend of music and fun!',
    date: new Date('2023-07-15'),
    startTime: '12:00',
    endTime: '22:00',
    location: 'Central Park, New York, NY',
    eventType: 'festival',
    capacity: '5000',
    organizer: {
      name: 'NYC Music Collective',
      avatar: '/placeholder.svg'
    },
    attendees: 3240,
    tags: ['Music', 'Outdoor', 'Festival', 'Live Performance'],
    image: '/placeholder.svg'
  };
  
  const handleRegister = () => {
    toast.success('Registration successful!', {
      description: `You're registered for "${event.title}". We've sent details to your email.`,
    });
  };
  
  const handleSave = () => {
    toast.success('Event saved!', {
      description: 'You can find this event in your saved items.',
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', {
      description: 'Share this event with your friends and network.',
    });
  };
  
  const handleAddToCalendar = () => {
    toast.success('Added to calendar!', {
      description: 'This event has been added to your calendar.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            <AnimatedSection animation="fade-in-up">
              <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] mb-8">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <Badge className="mb-3">{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <AnimatedSection animation="fade-in-up" delay={100} className="w-full md:w-8/12">
                <Card>
                  <CardHeader>
                    <CardTitle>About this event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {event.description}
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Date and Time</h3>
                          <p className="text-muted-foreground">
                            {format(event.date, 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Location</h3>
                          <p className="text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Attendees</h3>
                          <p className="text-muted-foreground">{event.attendees} / {event.capacity}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in-up" delay={200} className="w-full md:w-4/12">
                <Card>
                  <CardHeader>
                    <CardTitle>Registration</CardTitle>
                    <CardDescription>Secure your spot at this event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Availability</span>
                        <span className="font-medium">{event.capacity - event.attendees} spots left</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full" onClick={handleRegister}>
                      Register Now
                    </Button>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={handleSave}>
                        <Bookmark className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-1 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleAddToCalendar}>
                        <Calendar className="mr-1 h-4 w-4" />
                        Calendar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{event.organizer.name}</p>
                        <p className="text-sm text-muted-foreground">Event Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" 
                      onClick={() => navigate('/communities')}>
                      View Community
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedSection>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <AnimatedSection animation="slide-in-left" delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle>Similar Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex gap-4 cursor-pointer hover:bg-muted p-2 rounded-lg" 
                        onClick={() => navigate(`/events/${item + 1}`)}>
                        <img src="/placeholder.svg" alt="Event" className="w-20 h-20 rounded-md object-cover" />
                        <div>
                          <h3 className="font-medium line-clamp-1">Another Music Event {item}</h3>
                          <p className="text-sm text-muted-foreground">Aug {10 + item}, 2023</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">Downtown Music Hall</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/events')}>
                    View All Events
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
