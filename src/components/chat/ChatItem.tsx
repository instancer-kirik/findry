
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface ChatItemProps {
  chat: {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    isGroup?: boolean;
    members?: number;
  };
  active: boolean;
  onClick: () => void;
}

const ChatItem = ({ chat, active, onClick }: ChatItemProps) => {
  return (
    <div 
      className={`p-3 cursor-pointer hover:bg-muted/50 ${active ? 'bg-muted' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {chat.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium truncate">{chat.name}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <Badge className="ml-2 bg-orange-500">{chat.unread}</Badge>
            )}
          </div>
          
          {chat.isGroup && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {chat.members} members
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
