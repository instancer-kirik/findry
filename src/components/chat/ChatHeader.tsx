import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video } from 'lucide-react';
import VideoCallModal from '@/components/video/VideoCallModal';

interface ChatHeaderProps {
  chatData: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  } | undefined;
}

const ChatHeader = ({ chatData }: ChatHeaderProps) => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');

  if (!chatData) return null;

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowVideoCall(true);
  };
  
  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chatData.avatar} />
            <AvatarFallback>
              {chatData.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{chatData.name}</h3>
            <p className="text-sm text-muted-foreground">
              {chatData.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleStartCall('audio')}>
            <Phone className="h-4 w-4 mr-1" />
            Audio
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleStartCall('video')}>
            <Video className="h-4 w-4 mr-1" />
            Video
          </Button>
        </div>
      </div>

      <VideoCallModal
        open={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        callType={callType}
        roomName={`Call with ${chatData.name}`}
        participants={[
          { id: '1', name: 'You' },
          { id: '2', name: chatData.name, avatar: chatData.avatar }
        ]}
      />
    </>
  );
};

export default ChatHeader;
