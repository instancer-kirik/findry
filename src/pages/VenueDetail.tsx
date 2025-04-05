import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useVenue } from '@/hooks/use-venue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Tag, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import UserGeneratedContent from '@/components/profile/UserGeneratedContent';
import { mapVenueEventsToCalendarEvents } from '@/types/venue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VenueDetail: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { venue, isLoading, error, isOwner } = useVenue(venueId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !venue) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Venue not found</h2>
                <p className="text-muted-foreground mt-2">
                  The venue you're looking for doesn't exist or you don't have permission to view it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const calendarEvents = mapVenueEventsToCalendarEvents(venue);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Venue Banner */}
        <div className="relative w-full h-64 overflow-hidden rounded-lg mb-8">
          {venue.image_url ? (
            <img
              src={venue.image_url}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{venue.name}</h1>
            </div>
          )}
        </div>

        {/* Venue Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{venue.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                {venue.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.location}</span>
                  </div>
                )}
                {venue.capacity && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{venue.capacity}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button>Book Now</Button>
              {isOwner && (
                <Button variant="outline">Edit Venue</Button>
              )}
            </div>
          </div>
          
          {/* Tags */}
          {venue.tags && venue.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {venue.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="calendar">Schedule</TabsTrigger>
            <TabsTrigger value="content">Media & Content</TabsTrigger>
          </TabsList>
          
          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About the Venue</CardTitle>
              </CardHeader>
              <CardContent>
                {venue.description ? (
                  <p className="text-muted-foreground">{venue.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">No description available</p>
                )}
              </CardContent>
            </Card>
            
            {/* Amenities */}
            {venue.amenities && venue.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="h-2 w-2 bg-primary rounded-full" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Availability card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Book This Venue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Check availability and make a reservation for your event
                </p>
                <Button className="w-full">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Check Availability
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Venue Schedule</CardTitle>
                <CardDescription>
                  View upcoming and past events at this venue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileCalendar 
                  events={calendarEvents} 
                  isOwnProfile={isOwner} 
                  profileType="venue" 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <UserGeneratedContent 
              profileId={venueId || ''} 
              profileType="venue" 
              isOwner={isOwner} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VenueDetail;
