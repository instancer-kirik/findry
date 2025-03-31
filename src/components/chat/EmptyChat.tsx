
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle } from 'lucide-react';

const EmptyChat = () => {
  return (
    <div className="w-2/3 flex items-center justify-center">
      <div className="text-center">
        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
        <p className="text-muted-foreground">
          Choose a conversation from the list or start a new one
        </p>
        <Button className="mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default EmptyChat;
