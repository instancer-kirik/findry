import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useResourceDetails } from '@/hooks/use-resource';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Ruler, Clock, Tag, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import { mapResourceAvailabilityToCalendarEvents } from '@/types/resource';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const ResourceDetail: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { resource, isLoading, error, isOwner } = useResourceDetails(resourceId);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  if (error || !resource) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Resource not found</h2>
                <p className="text-muted-foreground mt-2">
                  The resource you're looking for doesn't exist or you don't have permission to view it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Fix the CalendarEvent type compatibility issue by using type assertion
  const calendarEvents = mapResourceAvailabilityToCalendarEvents(resource) as any;
  
  // Find today's availability
  const todayStr = format(selectedDate, 'yyyy-MM-dd');
  const todayAvailability = resource.availability?.find(
    day => day.date === todayStr
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Resource Banner */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            {resource.image_url ? (
              <img
                src={resource.image_url}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white">{resource.name}</h1>
              </div>
            )}
          </div>

          {/* Resource Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl">{resource.name}</CardTitle>
                      <CardDescription className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          {resource.type}
                        </Badge>
                        {resource.subtype && (
                          <Badge variant="outline">
                            {resource.subtype}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    {isOwner && (
                      <Button variant="outline">Edit Resource</Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Location and Size */}
                    <div className="flex flex-col gap-2">
                      {resource.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.location}</span>
                        </div>
                      )}
                      {resource.size_sqft && (
                        <div className="flex items-center gap-2 text-sm">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <span>Size: {resource.size_sqft} sq ft</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {resource.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-muted-foreground">{resource.description}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag, index) => (
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
                    Book This Resource
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

          {/* Availability and Calendar Tabs */}
          <Separator className="my-4" />
          <h2 className="text-2xl font-bold mt-4">Resource Availability</h2>
          
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="timeSlots">Available Time Slots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <ProfileCalendar 
                events={calendarEvents} 
                isOwnProfile={isOwner} 
                profileType="resource" 
              />
            </TabsContent>
            
            <TabsContent value="timeSlots">
              <Card>
                <CardHeader>
                  <CardTitle>Time Slots for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAvailability ? (
                    <ScrollArea className="h-[400px] pr-3">
                      <div className="space-y-3">
                        {todayAvailability.timeSlots.map((slot) => (
                          <div 
                            key={slot.id} 
                            className={`p-3 border rounded-md flex justify-between items-center ${
                              slot.status === 'available' 
                                ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                                : slot.status === 'booked'
                                ? 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800'
                                : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800'
                            }`}
                          >
                            <div>
                              <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                              <div className="text-sm text-muted-foreground capitalize">{slot.status}</div>
                            </div>
                            {slot.price && slot.status === 'available' && (
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold">${slot.price}</div>
                                <Button size="sm" variant="secondary">Book</Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        No availability information for this date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ResourceDetail;
