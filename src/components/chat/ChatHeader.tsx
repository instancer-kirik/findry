
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  chatData: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  } | undefined;
}

const ChatHeader = ({ chatData }: ChatHeaderProps) => {
  if (!chatData) return null;
  
  return (
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
        <Button variant="outline" size="sm">Audio</Button>
        <Button variant="outline" size="sm">Video</Button>
      </div>
    </div>
  );
};

export default ChatHeader;
