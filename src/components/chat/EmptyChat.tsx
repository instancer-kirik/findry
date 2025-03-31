
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle } from 'lucide-react';

const EmptyChat = () => {
  return (
    <div className="w-2/3 flex items-center justify-center bg-muted/10">
      <div className="text-center max-w-md p-6">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Your messages</h3>
        <p className="text-muted-foreground mb-6">
          Connect with artists, venues, and brands. Start a conversation about collaborations or upcoming events.
        </p>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
    </div>
  );
};

export default EmptyChat;
