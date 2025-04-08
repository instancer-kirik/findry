import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { CalendarClock, Clock, MapPin, Users, Search, CalendarIcon, Filter } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from '@/integrations/supabase/client';
import CreateEventModal from './CreateEventModal';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunityEvent {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  capacity: number | null;
  type: string | null;
  community_id: string | null;
  created_by: string | null;
  created_at: string;
  attendees_count?: number;
}

interface CommunityEventsProps {
  communityId: string;
}

const CommunityEvents: React.FC<CommunityEventsProps> = ({ communityId }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
  // Fetch community events
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['community-events', communityId],
    queryFn: async () => {
      try {
        // Get the community-specific event IDs from localStorage
        const storageKey = `community_${communityId}_events`;
        const communityEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Also try the old format as fallback
        const localRelationships = JSON.parse(localStorage.getItem('event_community_relationships') || '[]');
        const relationshipEvents = localRelationships.filter((rel: any) => rel.community_id === communityId);
        
        // Combine event IDs from both sources
        const eventIds = new Set<string>();
        
        // Add IDs from community-specific storage
        if (communityEvents && communityEvents.length > 0) {
          communityEvents.forEach((event: {event_id: string}) => eventIds.add(event.event_id));
        }
        
        // Add IDs from the old format storage
        if (relationshipEvents && relationshipEvents.length > 0) {
          relationshipEvents.forEach((event: {event_id: string}) => eventIds.add(event.event_id));
        }
        
        // If no events are associated with this community, return empty array
        if (eventIds.size === 0) {
          return [];
        }
        
        // Fetch the actual events
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .in('id', Array.from(eventIds))
          .order('start_date', { ascending: true });
          
        if (eventError) {
          console.error('Error fetching events:', eventError);
          throw eventError;
        }
        
        return eventData as unknown as CommunityEvent[];
      } catch (error) {
        console.error('Error fetching community events:', error);
        return [];
      }
    }
  });
  
  // Filter events based on search, type, date, and tab
  const filteredEvents = events?.filter(event => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    // Filter by event type
    const matchesType = selectedType === 'all' || event.type === selectedType;
    
    // Filter by selected date
    const matchesDate = !selectedDate || 
      (event.start_date && (
        format(parseISO(event.start_date), 'yyyy-MM-dd') === 
        format(selectedDate, 'yyyy-MM-dd')
      ));
    
    // Filter by tab (past/upcoming)
    const now = new Date();
    const isUpcoming = event.start_date ? 
      (isAfter(parseISO(event.start_date), now) || isToday(parseISO(event.start_date))) : 
      false;
    const matchesTab = (selectedTab === 'upcoming' && isUpcoming) || 
                      (selectedTab === 'past' && !isUpcoming);
    
    return matchesSearch && matchesType && matchesDate && matchesTab;
  }) || [];
  
  const handleRefreshEvents = () => {
    refetch();
  };
  
  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  const formatEventTime = (dateString: string | null) => {
    if (!dateString) return '';
    return format(parseISO(dateString), 'h:mm a');
  };
  
  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
              {selectedDate && (
                <div className="p-2 border-t flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
                    Clear
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <CreateEventModal communityId={communityId} onSuccess={handleRefreshEvents} />
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>{formatEventDate(event.start_date)}</span>
                        </div>
                      </div>
                      {event.type && (
                        <Badge variant="secondary">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {event.description || 'No description provided'}
                    </p>
                    <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                      {event.start_date && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {formatEventTime(event.start_date)}
                            {event.end_date && ` - ${formatEventTime(event.end_date)}`}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{event.attendees_count || 0} / {event.capacity}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {searchQuery || selectedType !== 'all' || selectedDate 
                  ? "Try changing your filters" 
                  : "There are no upcoming events for this community"}
              </p>
              <CreateEventModal communityId={communityId} onSuccess={handleRefreshEvents} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>{formatEventDate(event.start_date)}</span>
                        </div>
                      </div>
                      {event.type && (
                        <Badge variant="outline">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {event.description || 'No description provided'}
                    </p>
                    <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                      {event.start_date && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {formatEventTime(event.start_date)}
                            {event.end_date && ` - ${formatEventTime(event.end_date)}`}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{event.attendees_count || 0} / {event.capacity}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No past events found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || selectedType !== 'all' || selectedDate 
                  ? "Try changing your filters" 
                  : "There are no past events for this community"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityEvents; 