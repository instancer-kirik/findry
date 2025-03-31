
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
  compact?: boolean;
}

const ChatList = ({ chatList, activeChat, setActiveChat, compact = false }: ChatListProps) => {
  return (
    <Tabs defaultValue="all" className="flex-1 flex flex-col">
      <div className={`px-2 border-b ${compact ? 'py-1' : ''}`}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" className={compact ? 'text-xs py-1.5' : ''}>All</TabsTrigger>
          <TabsTrigger value="unread" className={compact ? 'text-xs py-1.5' : ''}>Unread</TabsTrigger>
          <TabsTrigger value="groups" className={compact ? 'text-xs py-1.5' : ''}>Groups</TabsTrigger>
        </TabsList>
      </div>
      
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <TabsContent value="all" className="m-0 h-full">
          {chatList.map(chat => (
            <ChatItem 
              key={chat.id} 
              chat={chat} 
              active={activeChat === chat.id}
              onClick={() => setActiveChat(chat.id)} 
              compact={compact}
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
              compact={compact}
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
              compact={compact}
            />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ChatList;
