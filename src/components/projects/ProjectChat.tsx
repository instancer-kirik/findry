
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Project, ProjectTask, ProjectComponent } from '@/types/project';

export interface ReferenceItem {
  type: 'component' | 'task';
  id: string;
  name: string;
}

export interface ProjectChatProps {
  project: Project;
  className?: string;
  onReferenceClick?: {
    component: (componentId: string) => void;
    task: (taskId: string) => void;
  };
  onStatusChange?: (newStatus: 'pending' | 'completed' | 'in_progress') => Promise<void>;
}

export interface ProjectChatRef {
  addReference: (item: ReferenceItem) => void;
}

const ProjectChat = forwardRef<ProjectChatRef, ProjectChatProps>(({
  project,
  className = '',
  onReferenceClick,
  onStatusChange
}, ref) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [referencesMenu, setReferencesMenu] = useState(false);
  const [references, setReferences] = useState<ReferenceItem[]>([]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    addReference: (item: ReferenceItem) => {
      setReferences(prev => [...prev, item]);
    }
  }));

  useEffect(() => {
    // Load initial messages
    const initialMessages = [
      {
        id: '1',
        sender: 'System',
        content: `Project "${project.name}" created`,
        timestamp: new Date().toISOString(),
        isNotification: true
      }
    ];
    
    setMessages(initialMessages);
  }, [project.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create new message
    const message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      references: [...references]
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReferences([]);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    const chatContainer = document.getElementById('project-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleReferenceClick = (reference: ReferenceItem) => {
    if (!onReferenceClick) return;
    
    if (reference.type === 'component') {
      onReferenceClick.component(reference.id);
    } else if (reference.type === 'task') {
      onReferenceClick.task(reference.id);
    }
  };

  const removeReference = (index: number) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div id="project-chat-messages" className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.isNotification ? 'justify-center' : 'gap-2'}`}>
            {message.isNotification ? (
              <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {message.content}
              </div>
            ) : (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1">{message.content}</div>
                  
                  {message.references && message.references.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.references.map((ref: ReferenceItem) => (
                        <button 
                          key={ref.id}
                          className="inline-flex items-center text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
                          onClick={() => handleReferenceClick(ref)}
                        >
                          {ref.type === 'component' ? '🧩' : '✓'} {ref.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center">
            <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Loading...
            </div>
          </div>
        )}
      </div>
      
      {references.length > 0 && (
        <div className="px-4 py-2 border-t flex flex-wrap gap-2">
          {references.map((ref, index) => (
            <div 
              key={index} 
              className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
            >
              {ref.type === 'component' ? '🧩' : '✓'} {ref.name}
              <button 
                className="ml-1 hover:text-destructive" 
                onClick={() => removeReference(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setReferencesMenu(!referencesMenu)}
            className="h-9 w-9"
          >
            +
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          <Button 
            type="button" 
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
});

ProjectChat.displayName = 'ProjectChat';

export default ProjectChat;
