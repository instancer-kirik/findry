
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatItem from './ChatItem';

interface ChatListProps {
  chatList: Array<{
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    isGroup?: boolean;
    members?: number;
  }>;
  activeChat: number | null;
  setActiveChat: (id: number) => void;
}

const ChatList = ({ chatList, activeChat, setActiveChat }: ChatListProps) => {
  return (
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
  );
};

export default ChatList;
