
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
}

const ChatInputBox = ({ onSendMessage }: ChatInputBoxProps) => {
  const [message, setMessage] = useState('');
  const isMobile = useIsMobile();

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-3 border-t bg-background">
      <div className="flex items-center gap-2">
        {!isMobile && (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
        )}
        
        <Input 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        
        {!isMobile && (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`rounded-full ${isMobile ? 'h-9 w-9 p-0' : 'h-10 w-10 p-0'}`}
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBox;
