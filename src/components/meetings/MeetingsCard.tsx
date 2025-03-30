
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Video, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingType: string;
  organizer: any;
  participants: any[];
  isPublic: boolean;
  meetingLink?: string;
  location?: string;
}

interface MeetingsCardProps {
  meetings: Meeting[];
  title?: string;
  limit?: number;
  showAll?: boolean;
}

const MeetingsCard: React.FC<MeetingsCardProps> = ({ 
  meetings, 
  title = "Upcoming Meetings", 
  limit = 3,
  showAll = false 
}) => {
  // Filter for upcoming meetings and sort by date
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Limit the number of meetings shown unless showAll is true
  const displayedMeetings = showAll ? upcomingMeetings : upcomingMeetings.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          {title}
          <Link to="/meetings">
            <Button variant="link" size="sm" className="p-0">View All</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedMeetings.length > 0 ? (
          displayedMeetings.map((meeting) => (
            <div key={meeting.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge className="mb-1">{meeting.meetingType === 'video' ? 'Video Call' : 'In Person'}</Badge>
                  <h3 className="font-medium">{meeting.title}</h3>
                </div>
                {meeting.meetingType === 'video' ? (
                  <Video className="h-4 w-4 text-primary" />
                ) : (
                  <Users className="h-4 w-4 text-primary" />
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                {meeting.description?.length > 80 
                  ? `${meeting.description.substring(0, 80)}...` 
                  : meeting.description}
              </div>
              
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span>{format(meeting.date, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, i) => (
                    <Avatar key={i} className="border-2 border-background w-6 h-6">
                      <AvatarImage src={participant.imageUrl} alt={participant.name} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>
                
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/meetings/${meeting.id}`}>Details</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming meetings</p>
            <Button size="sm" className="mt-2" asChild>
              <Link to="/meetings/schedule">Schedule a Meeting</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsCard;
