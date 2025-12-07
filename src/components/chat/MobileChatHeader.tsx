import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Video } from 'lucide-react';
import VideoCallModal from '@/components/video/VideoCallModal';

interface MobileChatHeaderProps {
  chatData: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  } | undefined;
  onBack: () => void;
}

const MobileChatHeader = ({ chatData, onBack }: MobileChatHeaderProps) => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');

  if (!chatData) return null;

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowVideoCall(true);
  };
  
  return (
    <>
      <div className="p-3 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={chatData.avatar} />
            <AvatarFallback>
              {chatData.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-sm">{chatData.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chatData.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartCall('audio')}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartCall('video')}>
            <Video className="h-4 w-4" />
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

export default MobileChatHeader;
