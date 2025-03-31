
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
}

const ChatInputBox = ({ onSendMessage }: ChatInputBoxProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="rounded-full h-10 w-10 p-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBox;
