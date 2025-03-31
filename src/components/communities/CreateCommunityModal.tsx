
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import CreateCommunityForm from './CreateCommunityForm';

interface CreateCommunityModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const CreateCommunityModal = ({ 
  trigger, 
  onSuccess 
}: CreateCommunityModalProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Create Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogDescription>
            Create a space for people with similar interests to connect, share ideas, and collaborate.
          </DialogDescription>
        </DialogHeader>
        <CreateCommunityForm 
          onSuccess={handleSuccess} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityModal;
