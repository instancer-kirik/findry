import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from "@/components/ui/input";
import { PlusCircle, SearchIcon, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatList from '@/components/chat/ChatList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInputBox from '@/components/chat/ChatInputBox';
import EmptyChat from '@/components/chat/EmptyChat';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MobileChatHeader from '@/components/chat/MobileChatHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatNotifications } from '@/hooks/use-chat-notifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from 'react-router-dom';

const Chats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const chatIdFromQuery = params.get('id');
  
  const [activeChat, setActiveChat] = useState<number | null>(chatIdFromQuery ? parseInt(chatIdFromQuery) : 1);
  const [activeTab, setActiveTab] = useState<string>('chats');
  const isMobile = useIsMobile();
  
  // Use our notifications hook
  const { notifications, unreadCount, markAsRead, markAllAsRead, navigateToSource } = useChatNotifications();

  // Update URL when active chat changes
  useEffect(() => {
    if (activeChat) {
      const newUrl = `/chats?id=${activeChat}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [activeChat]);

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

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      console.log("Sending message:", message);
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      navigateToSource(notification);
    }
  };

  // Mobile view using Drawer/Sheet
  if (isMobile) {
    return (
      <Layout>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {activeChat ? (
            <>
              <MobileChatHeader 
                chatData={chatList.find(c => c.id === activeChat)} 
                onBack={() => setActiveChat(null)} 
              />
              <ChatMessages 
                messages={messages} 
                activeChatData={chatList.find(c => c.id === activeChat)} 
                className="flex-1 pb-16"
              />
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
                <ChatInputBox onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            <div className="p-4 h-full">
              <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="chats">Messages</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <Button size="icon" variant="ghost">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="relative mb-4">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
                
                <TabsContent value="chats" className="m-0">
                  <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                    <ChatList 
                      chatList={chatList} 
                      activeChat={activeChat} 
                      setActiveChat={setActiveChat} 
                      compact={true}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="m-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                    {notifications.length > 0 ? (
                      <div className="space-y-2">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-3 rounded-md cursor-pointer ${notification.read ? 'bg-card' : 'bg-accent'}`}
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.avatarUrl} />
                                <AvatarFallback>{notification.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">{notification.sourceName}</p>
                                  <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                                <Badge variant="outline" className="mt-1 text-[10px] px-1.5">
                                  {notification.source === 'project' ? 'Project' : 'Chat'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Desktop view
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
        <div className="flex h-full rounded-lg overflow-hidden border shadow-sm">
          <div className="w-1/3 border-r flex flex-col bg-background">
            <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="chats">Messages</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <Button size="icon" variant="ghost">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </div>

              <TabsContent value="chats" className="flex-1 m-0 overflow-hidden flex flex-col">
                <ChatList 
                  chatList={chatList} 
                  activeChat={activeChat} 
                  setActiveChat={(id) => setActiveChat(id)} 
                />
              </TabsContent>
              
              <TabsContent value="notifications" className="flex-1 m-0 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-3 border-b">
                  <h3 className="text-sm font-medium">All Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 ${notification.read ? '' : 'bg-accent/20'}`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={notification.avatarUrl} />
                              <AvatarFallback>{notification.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{notification.sourceName}</p>
                                <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                              <Badge variant="outline" className="mt-2">
                                {notification.source === 'project' ? 'Project Chat' : 'Direct Message'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {activeChat ? (
            <div className="w-2/3 flex flex-col bg-muted/10">
              <ChatHeader chatData={chatList.find(c => c.id === activeChat)} />
              <ChatMessages 
                messages={messages} 
                activeChatData={chatList.find(c => c.id === activeChat)} 
              />
              <ChatInputBox onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chats;
