
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from "@/components/ui/input";
import { PlusCircle, SearchIcon } from 'lucide-react';
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

const Chats = () => {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const isMobile = useIsMobile();

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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Messages</h2>
                <Button size="icon" variant="ghost">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-12rem)]">
                <ChatList 
                  chatList={chatList} 
                  activeChat={activeChat} 
                  setActiveChat={setActiveChat} 
                  compact={true}
                />
              </div>
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

            <ChatList 
              chatList={chatList} 
              activeChat={activeChat} 
              setActiveChat={(id) => setActiveChat(id)} 
            />
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
