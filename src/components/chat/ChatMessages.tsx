
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const ChatMessages = ({ messages, activeChatData, className }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn("flex-1 p-4 overflow-y-auto thin-scrollbar", className)}>
      <div className="space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender !== 'me' && activeChatData && (
              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                <AvatarImage src={activeChatData.avatar} />
                <AvatarFallback>
                  {activeChatData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-[85%] sm:max-w-[70%]">
              <div 
                className={`rounded-lg px-4 py-2 ${
                  msg.sender === 'me' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
