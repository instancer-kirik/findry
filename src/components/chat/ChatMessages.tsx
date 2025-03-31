
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

interface ChatMessagesProps {
  messages: Message[];
  activeChatData: {
    id: number;
    name: string;
    avatar: string;
  } | undefined;
}

const ChatMessages = ({ messages, activeChatData }: ChatMessagesProps) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender !== 'me' && activeChatData && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src={activeChatData.avatar} />
                <AvatarFallback>
                  {activeChatData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <div 
                className={`rounded-lg px-4 py-2 max-w-md ${
                  msg.sender === 'me' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {msg.text}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
