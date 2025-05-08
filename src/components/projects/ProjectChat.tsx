import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useProjectInteractions from '@/hooks/use-project-interactions';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface ProjectChatProps {
  projectId: string;
  userId: string;
}

const ProjectChat: React.FC<ProjectChatProps> = ({ projectId, userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { components, loading, error } = useProjectInteractions(projectId);

  useEffect(() => {
    // Simulate fetching initial messages (replace with actual data fetching)
    const initialMessages: ChatMessage[] = [
      { id: '1', text: 'Welcome to the project chat!', sender: 'System', timestamp: new Date() },
      { id: '2', text: 'Feel free to discuss project details here.', sender: 'System', timestamp: new Date() },
    ];
    setMessages(initialMessages);

    // Scroll to bottom on initial load
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newChatMessage: ChatMessage = {
        id: String(messages.length + 1), // Replace with a proper ID generator
        text: newMessage,
        sender: userId,
        timestamp: new Date(),
      };
      setMessages([...messages, newChatMessage]);
      setNewMessage('');
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Project Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-2 p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === userId ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2">
                  {message.sender !== userId && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${message.sender}.png`} alt={message.sender} />
                      <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="rounded-lg px-3 py-2 text-sm w-fit max-w-[75%] break-words"
                    style={{
                      backgroundColor: message.sender === userId ? '#dcf8c6' : '#fff',
                    }}
                  >
                    <p className="font-medium">{message.sender}</p>
                    <p>{message.text}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={chatBottomRef} /> {/* Empty div to help scroll to bottom */}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-3">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectChat;
