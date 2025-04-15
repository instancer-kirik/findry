
import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Link2, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { useProjectChat, ProjectMessage } from '@/hooks/use-project-chat';
import { Project, ProjectTask, ProjectEvent } from '@/types/project';
import { toast } from 'sonner';
import { useProjectInteractions } from '@/hooks/use-project-interactions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ProjectChatProps {
  project: Project;
  className?: string;
  onReferenceClick?: {
    component?: (componentId: string) => void;
    task?: (taskId: string) => void;
  };
  onStatusChange?: (newStatus: Project['status']) => Promise<boolean>;
}

interface ReferenceItem {
  id: string;
  type: 'component' | 'task';
  name: string;
  status: string;
}

export type { ReferenceItem };

const ProjectChat = forwardRef<
  { addReference: (item: ReferenceItem) => void },
  ProjectChatProps
>(({ project, className, onReferenceClick }, ref) => {
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [openReferencePopover, setOpenReferencePopover] = useState(false);
  const [selectedReferences, setSelectedReferences] = useState<ReferenceItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  useImperativeHandle(ref, () => ({
    addReference: (item: ReferenceItem) => {
      if (!selectedReferences.some(ref => ref.id === item.id && ref.type === item.type)) {
        setSelectedReferences(prev => [...prev, item]);
      }
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }));
  
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    sendProjectUpdate 
  } = useProjectChat({ 
    projectId: project.id, 
    projectName: project.name 
  });
  
  const referenceableItems: ReferenceItem[] = [
    ...(project.components || []).map(component => ({
      id: component.id,
      type: 'component' as const,
      name: component.name,
      status: component.status
    })),
    ...(project.tasks || []).map(task => ({
      id: task.id,
      type: 'task' as const,
      name: task.title,
      status: task.status
    }))
  ];
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedReferences.length === 0) || !user) return;
    
    let messageContent = newMessage;
    
    if (selectedReferences.length > 0) {
      messageContent += '\n\nReferences:';
      selectedReferences.forEach(ref => {
        messageContent += `\n• [${ref.type.charAt(0).toUpperCase() + ref.type.slice(1)}: ${ref.name}](#${ref.type}/${ref.id})`;
      });
    }
    
    await sendMessage(messageContent);
    
    setNewMessage('');
    setSelectedReferences([]);
  };
  
  const handleSelectReference = (item: ReferenceItem) => {
    if (!selectedReferences.some(ref => ref.id === item.id && ref.type === item.type)) {
      setSelectedReferences(prev => [...prev, item]);
    }
    setOpenReferencePopover(false);
    
    inputRef.current?.focus();
  };
  
  const handleRemoveReference = (item: ReferenceItem) => {
    setSelectedReferences(prev => 
      prev.filter(ref => !(ref.id === item.id && ref.type === item.type))
    );
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };
  
  const formatMessageWithReferences = (content: string) => {
    if (!content.includes('References:')) {
      return <p>{content}</p>;
    }
    
    const parts = content.split('\n\nReferences:');
    const regularContent = parts[0];
    const references = parts[1];
    
    const referenceRegex = /• \[(Component|Task): (.+?)\]\(#(component|task)\/(.+?)\)/g;
    let formattedReferences: JSX.Element[] = [];
    let match;
    let lastIndex = 0;
    
    while ((match = referenceRegex.exec(references)) !== null) {
      const type = match[3];
      const id = match[4];
      const name = match[2];
      
      if (match.index > lastIndex) {
        formattedReferences.push(
          <span key={`text-${lastIndex}`}>
            {references.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      formattedReferences.push(
        <Badge 
          key={`ref-${type}-${id}`} 
          variant="outline"
          className="mx-1 cursor-pointer hover:bg-accent"
          onClick={() => handleReferenceClick(type, id)}
        >
          {match[1]}: {name}
        </Badge>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < references.length) {
      formattedReferences.push(
        <span key={`text-end`}>
          {references.substring(lastIndex)}
        </span>
      );
    }
    
    return (
      <>
        <p>{regularContent}</p>
        <div className="mt-2 text-xs">
          <p className="text-muted-foreground mb-1">References:</p>
          <div className="flex flex-wrap gap-1">
            {formattedReferences}
          </div>
        </div>
      </>
    );
  };
  
  const handleReferenceClick = (type: string, id: string) => {
    if (type === 'component' && onReferenceClick?.component) {
      onReferenceClick.component(id);
    } else if (type === 'task' && onReferenceClick?.task) {
      onReferenceClick.task(id);
    } else {
      console.log(`Navigate to ${type} with id ${id}`);
      toast.info(`Clicked on ${type} with id ${id}`);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Project Communication</CardTitle>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="chat"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0">
            {loading ? (
              <CardContent className="h-[320px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </CardContent>
            ) : error ? (
              <CardContent className="h-[320px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 mb-2">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardContent className="h-[320px] overflow-y-auto px-4 py-2">
                  <div className="space-y-4">
                    {messages.filter(msg => !msg.is_notification).map((message) => (
                      <div 
                        key={message.id}
                        className={`flex items-start gap-2 ${message.user_id === user?.id ? 'justify-end' : ''}`}
                      >
                        {message.user_id !== user?.id && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={message.user_avatar} />
                            <AvatarFallback>
                              {message.user_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[80%] space-y-1 ${message.user_id === user?.id ? 'items-end' : ''}`}>
                          {message.user_id !== user?.id && (
                            <p className="text-xs font-medium">{message.user_name}</p>
                          )}
                          <div className={`rounded-lg px-3 py-2 text-sm ${
                            message.user_id === user?.id 
                              ? 'bg-primary text-primary-foreground ml-auto' 
                              : 'bg-muted'
                          }`}>
                            {formatMessageWithReferences(message.content)}
                          </div>
                          <p className={`text-xs text-muted-foreground ${message.user_id === user?.id ? 'text-right' : ''}`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                {selectedReferences.length > 0 && (
                  <div className="px-4 py-2 border-t flex flex-wrap gap-1">
                    {selectedReferences.map(ref => (
                      <Badge key={`${ref.type}-${ref.id}`} variant="secondary" className="flex items-center gap-1">
                        {ref.type === 'component' ? 'Component: ' : 'Task: '}
                        {ref.name}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0 hover:bg-secondary-foreground/20 rounded-full"
                          onClick={() => handleRemoveReference(ref)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <CardFooter className="flex gap-2 pt-0">
                  <Popover open={openReferencePopover} onOpenChange={setOpenReferencePopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="flex-shrink-0">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="top" align="start">
                      <Command>
                        <CommandInput placeholder="Search components or tasks..." />
                        <CommandList>
                          <CommandEmpty>No items found.</CommandEmpty>
                          <CommandGroup heading="Components">
                            {referenceableItems
                              .filter(item => item.type === 'component')
                              .map(item => (
                                <CommandItem 
                                  key={`component-${item.id}`}
                                  onSelect={() => handleSelectReference(item)}
                                >
                                  <span className="mr-2">🧩</span>
                                  {item.name}
                                  <Badge className="ml-2" variant="outline">{item.status}</Badge>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                          <CommandGroup heading="Tasks">
                            {referenceableItems
                              .filter(item => item.type === 'task')
                              .map(item => (
                                <CommandItem 
                                  key={`task-${item.id}`}
                                  onSelect={() => handleSelectReference(item)}
                                >
                                  <span className="mr-2">✓</span>
                                  {item.name}
                                  <Badge className="ml-2" variant="outline">{item.status}</Badge>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 project-chat-input"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && selectedReferences.length === 0}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="updates" className="mt-0">
            {loading ? (
              <CardContent className="h-[320px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </CardContent>
            ) : error ? (
              <CardContent className="h-[320px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 mb-2">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="h-[320px] overflow-y-auto px-4 py-2">
                <div className="space-y-3">
                  {messages.filter(msg => msg.is_notification).map((notification) => (
                    <div key={notification.id} className="border rounded-md p-3 bg-muted/30">
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(notification.created_at)}
                      </p>
                    </div>
                  ))}
                  
                  {messages.filter(msg => msg.is_notification).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No project updates yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
});

ProjectChat.displayName = "ProjectChat";

export default ProjectChat;
