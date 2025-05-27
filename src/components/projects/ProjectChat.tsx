
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, MessageSquare, ExternalLink } from 'lucide-react';
import { Project, ProjectStatus } from '@/types/project';
import { useProjectChat } from '@/hooks/use-project-chat';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ReferenceItem {
  id: string;
  name: string;
  type: string;
  url?: string;
  description?: string;
  version?: string;
  status?: string;
}

interface ProjectChatProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
  onReferenceClick?: {
    component?: (componentId: string) => void;
    task?: (taskId: string) => void;
  };
  onStatusChange?: (newStatus: ProjectStatus) => Promise<void>;
}

interface ChatInputRef {
  addReference: (item: ReferenceItem) => void;
}

const ProjectChat = forwardRef<ChatInputRef, ProjectChatProps>(({ project, className, onReferenceClick, onStatusChange, ...props }, ref) => {
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState<ReferenceItem | null>(null);
  const { messages, addMessage, isLoading, addSystemMessage, isAddingMessage } = useProjectChat(project.id);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    addReference: (item: ReferenceItem) => {
      setReference(item);
      toast.info(`Referencing ${item.type} "${item.name}" in your next message.`, {
        action: {
          label: 'Clear',
          onClick: () => setReference(null),
        },
      });
    },
  }));

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addMessage({
        content: message,
        reference: reference
          ? {
            type: reference.type as 'component' | 'task',
            id: reference.id,
            name: reference.name,
            status: reference.status
          }
          : undefined,
      });
      setMessage('');
      setReference(null);
      scrollToBottom();
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    try {
      if (onStatusChange) {
        await onStatusChange(newStatus);
        await addSystemMessage(`Project status changed to ${newStatus}`);
        scrollToBottom();
      } else {
        toast.error('You are not authorized to change the project status.');
      }
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const handleReferenceClick = (item: ReferenceItem) => {
    if (item.type === 'component' && onReferenceClick?.component) {
      onReferenceClick.component(item.id);
    } else if (item.type === 'task' && onReferenceClick?.task) {
      onReferenceClick.task(item.id);
    } else {
      toast.error('No action defined for this reference type.');
    }
  };

  return (
    <Card className={cn("w-full rounded-md border", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 mr-1" /> Project Chat
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pl-2 pr-2 pb-2 pt-0">
        <div className="relative h-[400px] w-full overflow-hidden rounded-md border">
          <ScrollArea className="h-full w-full pr-2">
            <div className="flex flex-col gap-2 p-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-bold">{msg.userName}</div>
                    <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                    {msg.isNotification && <Badge variant="outline">System</Badge>}
                  </div>
                  <div className="prose max-w-none break-words dark:prose-invert text-sm">
                    {msg.content}
                    {msg.reference && (
                      <Button variant="link" className="p-0" onClick={() => handleReferenceClick(msg.reference as ReferenceItem)}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {msg.reference.type}: {msg.reference.name}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          </ScrollArea>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          {reference && (
            <Badge variant="secondary" className="relative">
              Referencing {reference.type}: {reference.name}
              <Button variant="ghost" size="icon" className="absolute -top-1 -right-1" onClick={() => setReference(null)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Input
            type="text"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={isAddingMessage}>
            {isAddingMessage ? <span className="animate-pulse">Sending...</span> : <Send className="h-4 w-4 mr-2" />}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectChat.displayName = 'ProjectChat';

export default ProjectChat;
