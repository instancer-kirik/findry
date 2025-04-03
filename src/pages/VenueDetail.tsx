
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useVenue } from '@/hooks/use-venue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import { mapVenueEventsToCalendarEvents } from '@/types/venue';

const VenueDetail: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { venue, isLoading, error, isOwner } = useVenue(venueId);

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
        <div className="grid grid-cols-1 gap-8">
          {/* Venue Banner */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
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

          {/* Venue Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl">{venue.name}</CardTitle>
                      {venue.type && (
                        <CardDescription>
                          <Badge variant="outline" className="mt-2">
                            {venue.type}
                          </Badge>
                        </CardDescription>
                      )}
                    </div>
                    {isOwner && (
                      <Button variant="outline">Edit Venue</Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Location and Capacity */}
                    <div className="flex flex-col gap-2">
                      {venue.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{venue.location}</span>
                        </div>
                      )}
                      {venue.capacity && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Capacity: {venue.capacity} people</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {venue.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-muted-foreground">{venue.description}</p>
                      </div>
                    )}

                    {/* Amenities */}
                    {venue.amenities && venue.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {venue.amenities.map((amenity, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <span className="h-2 w-2 bg-primary rounded-full" />
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {venue.tags && venue.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {venue.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Book This Venue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Check availability and make a reservation
                  </p>
                  <Button className="w-full">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Check Availability
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calendar */}
          <Separator className="my-4" />
          <h2 className="text-2xl font-bold mt-4">Venue Schedule</h2>
          <ProfileCalendar 
            events={calendarEvents} 
            isOwnProfile={isOwner} 
            profileType="venue" 
          />
        </div>
      </div>
    </Layout>
  );
};

export default VenueDetail;
