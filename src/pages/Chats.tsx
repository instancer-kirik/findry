import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Phone, Video, MoreVertical, Users, UserPlus, Bell, FileText } from 'lucide-react';

const Chats = () => {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const chatList = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Let's talk about the upcoming art exhibition.",
      time: "10:30 AM",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      lastMessage: "I reviewed your portfolio. Amazing work!",
      time: "Yesterday",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Digital Artists Group",
      avatar: "/placeholder.svg",
      lastMessage: "Alex: Has anyone tried the new Procreate update?",
      time: "Yesterday",
      unread: 5,
      online: true,
      isGroup: true,
      members: 8
    },
    {
      id: 4,
      name: "Jaime Rivera",
      avatar: "/placeholder.svg",
      lastMessage: "Can we schedule a call to discuss the project?",
      time: "Monday",
      unread: 0,
      online: false
    }
  ];

  const messages = [
    { id: 1, sender: "other", text: "Hey! I saw your recent work on Instagram. It's amazing!", time: "10:15 AM" },
    { id: 2, sender: "me", text: "Thank you! I've been experimenting with some new techniques.", time: "10:18 AM" },
    { id: 3, sender: "other", text: "It really shows. Would you be interested in collaborating on a project?", time: "10:20 AM" },
    { id: 4, sender: "other", text: "I'm working on an exhibition next month and looking for artists.", time: "10:21 AM" },
    { id: 5, sender: "me", text: "That sounds interesting! What kind of exhibition is it?", time: "10:25 AM" },
    { id: 6, sender: "other", text: "It's a digital art showcase focusing on environmental themes. Your style would be perfect for it.", time: "10:28 AM" },
    { id: 7, sender: "me", text: "I'd definitely be interested! Let's talk more about the details.", time: "10:30 AM" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage('');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
        <div className="flex h-full rounded-lg overflow-hidden border">
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Messages</h2>
                <Button size="icon" variant="ghost">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <div className="px-2 border-b">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="groups">Groups</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="all" className="m-0 h-full">
                  {chatList.map(chat => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      active={activeChat === chat.id}
                      onClick={() => setActiveChat(chat.id)} 
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0 h-full">
                  {chatList.filter(chat => chat.unread > 0).map(chat => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      active={activeChat === chat.id}
                      onClick={() => setActiveChat(chat.id)} 
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="groups" className="m-0 h-full">
                  {chatList.filter(chat => chat.isGroup).map(chat => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      active={activeChat === chat.id}
                      onClick={() => setActiveChat(chat.id)} 
                    />
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {activeChat ? (
            <div className="w-2/3 flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={chatList.find(c => c.id === activeChat)?.avatar} />
                    <AvatarFallback>
                      {chatList.find(c => c.id === activeChat)?.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {chatList.find(c => c.id === activeChat)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chatList.find(c => c.id === activeChat)?.online ? 
                        'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Audio</Button>
                  <Button variant="outline" size="sm">Video</Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender !== 'me' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={chatList.find(c => c.id === activeChat)?.avatar} />
                          <AvatarFallback>
                            {chatList.find(c => c.id === activeChat)?.name.slice(0, 2).toUpperCase()}
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

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="rounded-full h-10 w-10 p-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-2/3 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list or start a new one
                </p>
                <Button className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

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

export default Chats;
