
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Video } from 'lucide-react';

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
  if (!chatData) return null;
  
  return (
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileChatHeader;
