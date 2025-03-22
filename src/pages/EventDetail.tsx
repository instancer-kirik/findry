
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Heart, 
  MessageSquare, 
  Star,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { format } from 'date-fns';

// Mock data for event details
const eventMockData = {
  id: '1',
  title: 'Summer Music Festival',
  description: 'Join us for a weekend of amazing music featuring local and international artists. This family-friendly event includes food vendors, art installations, and activities for all ages.',
  longDescription: 'The Summer Music Festival is the highlight of the season, bringing together musical talents from across the globe. Set in the beautiful outdoor amphitheater, this three-day extravaganza features multiple stages, interactive art installations, and a diverse lineup of performers spanning genres from indie rock to electronic, jazz, and world music.\n\nIn addition to the musical performances, attendees can enjoy culinary delights from local food vendors, browse handcrafted goods at the artisan market, and participate in workshops and activities suitable for all ages. The festival grounds open at 11 AM each day, with performances running until 11 PM.\n\nFor families, a dedicated kids' zone offers face painting, musical instrument crafting, and other fun activities to keep younger attendees engaged and entertained.',
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
};

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
  const { id } = useParams<{ id: string }>();
  const [event] = useState(eventMockData);
  const [isAttending, setIsAttending] = useState(event.attending);
  const [isInterested, setIsInterested] = useState(event.interested);
  const [activeTab, setActiveTab] = useState('details');
  
  // This would be an API call in a real app
  const handleAttend = () => {
    setIsAttending(!isAttending);
  };
  
  const handleInterest = () => {
    setIsInterested(!isInterested);
  };
  
  // Calculate days remaining until event
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
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Event cover image */}
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
              
              {/* Event actions */}
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
                </div>
              </AnimatedSection>
              
              {/* Event tabs */}
              <AnimatedSection animation="fade-in-up" delay={200}>
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 w-full mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attendees">Attendees</TabsTrigger>
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
            
            {/* Sidebar */}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <Link key={item} to={`/events/${item + 1}`} className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium line-clamp-1">Similar Festival {item}</h3>
                            <p className="text-xs text-muted-foreground">Aug {10 + item}, 2023</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default EventDetail;
