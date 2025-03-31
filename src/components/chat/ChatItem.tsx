
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
  compact?: boolean;
}

const ChatItem = ({ chat, active, onClick, compact = false }: ChatItemProps) => {
  return (
    <div 
      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${active ? 'bg-muted' : ''} ${compact ? 'py-2' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className={compact ? "h-10 w-10" : "h-12 w-12"}>
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {chat.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>{chat.name}</h4>
            <span className={`text-xs text-muted-foreground whitespace-nowrap ml-2 ${compact ? 'text-[10px]' : ''}`}>{chat.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`text-sm text-muted-foreground truncate ${compact ? 'text-xs' : ''}`}>{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <Badge className={`ml-2 bg-primary ${compact ? 'text-[10px] px-1.5 py-0' : ''}`}>{chat.unread}</Badge>
            )}
          </div>
          
          {chat.isGroup && (
            <div className={`flex items-center mt-1 text-xs text-muted-foreground ${compact ? 'text-[10px]' : ''}`}>
              <Users className={`mr-1 ${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
              {chat.members} members
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
