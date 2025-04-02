import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Booking {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  client: string;
}

interface StudioSchedulerProps {
  bookings: Booking[];
}

const StudioScheduler: React.FC<StudioSchedulerProps> = ({ bookings }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Studio Schedule
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/studio/schedule" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Today's Bookings</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {booking.title}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.client}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(booking.startTime, 'h:mm a')} -{' '}
                        {format(booking.endTime, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudioScheduler; 