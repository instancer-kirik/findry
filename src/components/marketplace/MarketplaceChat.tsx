
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import GlassmorphicCard from '../ui-custom/GlassmorphicCard';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

const MarketplaceChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeChat, setActiveChat] = useState<string>("Elena Rivera");
  
  // Sample conversations
  const conversations = [
    { id: "1", name: "Elena Rivera", unread: 2, type: "artist" },
    { id: "2", name: "Summit Beats", unread: 0, type: "brand" },
    { id: "3", name: "The Acoustic Lounge", unread: 1, type: "venue" }
  ];
  
  // Sample messages
  const messages: Record<string, ChatMessage[]> = {
    "Elena Rivera": [
      {
        id: "1",
        sender: "Elena Rivera",
        content: "Hi there! I saw your profile and I'm interested in discussing potential collaboration opportunities.",
        timestamp: new Date(2023, 4, 20, 14, 30),
        isOwn: false
      },
      {
        id: "2",
        sender: "You",
        content: "Hello Elena! Thanks for reaching out. I'd love to hear more about what you have in mind.",
        timestamp: new Date(2023, 4, 20, 14, 35),
        isOwn: true
      },
      {
        id: "3",
        sender: "Elena Rivera",
        content: "Great! I'm planning a tour next month and looking for opening acts. Would you be interested?",
        timestamp: new Date(2023, 4, 20, 14, 40),
        isOwn: false
      }
    ],
    "Summit Beats": [
      {
        id: "1",
        sender: "You",
        content: "Hi Summit Beats, I love your production work and wonder if you'd be interested in working on my upcoming EP?",
        timestamp: new Date(2023, 4, 19, 10, 15),
        isOwn: true
      },
      {
        id: "2",
        sender: "Summit Beats",
        content: "Thanks for reaching out! We're currently booking for next quarter. Can you send over some of your previous work?",
        timestamp: new Date(2023, 4, 19, 11, 30),
        isOwn: false
      }
    ],
    "The Acoustic Lounge": [
      {
        id: "1",
        sender: "The Acoustic Lounge",
        content: "We have an opening for this Saturday night. Would you be available to perform?",
        timestamp: new Date(2023, 4, 18, 9, 10),
        isOwn: false
      }
    ]
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    // In a real app, this would send the message to a backend
    console.log(`Sending message to ${activeChat}: ${message}`);
    
    // Clear input
    setMessage("");
  };

  const typeColor = {
    artist: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    brand: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    venue: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </CardHeader>
      
      {isExpanded && (
        <>
          {/* Chat List */}
          <div className="px-4 pb-2 border-b">
            <div className="flex flex-col space-y-2">
              {conversations.map((convo) => (
                <div 
                  key={convo.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-secondary/50 ${activeChat === convo.name ? 'bg-secondary' : ''}`}
                  onClick={() => setActiveChat(convo.name)}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-secondary rounded-full p-1">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{convo.name}</p>
                      <span 
                        className={`text-xs ${convo.type && typeColor[convo.type as keyof typeof typeColor]}`}
                      >
                        {convo.type.charAt(0).toUpperCase() + convo.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  {convo.unread > 0 && (
                    <Badge variant="default" className="text-xs rounded-full px-2">
                      {convo.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Messages */}
          <CardContent className="p-3 h-64 overflow-y-auto">
            <div className="flex flex-col space-y-3">
              {activeChat && messages[activeChat] && messages[activeChat].map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <GlassmorphicCard 
                    className={`max-w-[80%] p-3 ${msg.isOwn ? 'bg-primary/10' : 'bg-secondary/50'}`}
                    intensity="light"
                  >
                    <div className="flex flex-col space-y-1">
                      {!msg.isOwn && (
                        <p className="text-xs font-medium">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-muted-foreground text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </GlassmorphicCard>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <CardFooter className="p-3 border-t">
            <div className="relative w-full flex items-center">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 p-1 rounded-full hover:bg-secondary"
                disabled={message.trim() === ""}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default MarketplaceChat;
