import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useProjectInteractions from '@/hooks/use-project-interactions';
import { Project, ProjectMessage } from '@/types/project';

// Export the ReferenceItem interface
export interface ReferenceItem {
  id: string;
  type: 'component' | 'task';
  name: string;
  status: string;
}

export interface ProjectChatProps {
  project: Project;
  className?: string;
  onReferenceClick?: {
    component?: (componentId: string) => void;
    task?: (taskId: string) => void;
  };
  onStatusChange?: (newStatus: Project['status']) => Promise<boolean>;
  ref?: React.Ref<{ addReference: (item: ReferenceItem) => void }>;
}

// Add forwardRef to support refs
const ProjectChat = forwardRef<{ addReference: (item: ReferenceItem) => void }, ProjectChatProps>(
  ({ project, className, onReferenceClick, onStatusChange }, ref) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ProjectMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Expose addReference method to parent components
    useImperativeHandle(ref, () => ({
      addReference: (item: ReferenceItem) => {
        const referenceText = `@${item.type === 'component' ? 'Component' : 'Task'}: ${item.name}`;
        setMessage(prev => {
          if (prev.trim() === '') return referenceText;
          return `${prev} ${referenceText}`;
        });
      }
    }));

    useEffect(() => {
      // Simulate fetching initial messages (replace with actual data fetching)
      const initialMessages: ProjectMessage[] = [
        { 
          id: '1', 
          projectId: project.id, 
          userId: 'system', 
          userName: 'System', 
          content: 'Welcome to the project chat!', 
          createdAt: new Date().toISOString(), 
          isNotification: true 
        },
        { 
          id: '2', 
          projectId: project.id, 
          userId: 'system', 
          userName: 'System', 
          content: 'Feel free to discuss project details here.', 
          createdAt: new Date().toISOString(), 
          isNotification: true 
        },
      ];
      setMessages(initialMessages);

      // Scroll to bottom on initial load
      scrollToBottom();
    }, [project.id]);

    useEffect(() => {
      // Scroll to bottom when new messages are added
      scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
      if (message.trim() !== '') {
        setIsSending(true);
        try {
          // Simulate sending message to server (replace with actual API call)
          const newMessageData = {
            id: String(messages.length + 1), // Replace with a proper ID generator
            projectId: project.id,
            userId: 'user-123', // Replace with actual user ID
            userName: 'You', // Replace with actual user name
            content: message,
            createdAt: new Date().toISOString(),
            isNotification: false,
          };

          setMessages([...messages, newMessageData]);
          setMessage('');
        } catch (err) {
          console.error("Error sending message:", err);
        } finally {
          setIsSending(false);
        }
      }
    };

    return (
      <Card className={`w-full h-full flex flex-col ${className}`}>
        <CardHeader>
          <CardTitle>Project Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-2 p-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.userId === 'user-123' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-2">
                    {msg.userId !== 'user-123' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${msg.userId}.png`} alt={msg.userName} />
                        <AvatarFallback>{msg.userName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="rounded-lg px-3 py-2 text-sm w-fit max-w-[75%] break-words"
                      style={{
                        backgroundColor: msg.userId === 'user-123' ? '#dcf8c6' : '#fff',
                      }}
                    >
                      <p className="font-medium">{msg.userName}</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Empty div to help scroll to bottom */}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-3">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSending) {
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />
            <Button onClick={handleSendMessage} disabled={isSending}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);

ProjectChat.displayName = 'ProjectChat';

export default ProjectChat;
