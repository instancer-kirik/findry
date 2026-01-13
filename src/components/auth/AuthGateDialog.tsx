import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AuthGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionType: string; // e.g., "create an event", "add an artist", "create a project"
  emailSubject?: string;
  emailMessage?: string;
}

const AuthGateDialog: React.FC<AuthGateDialogProps> = ({
  open,
  onOpenChange,
  title = "Authentication Required",
  description,
  actionType,
  emailSubject,
  emailMessage,
}) => {
  const navigate = useNavigate();

  const handleEmailUs = () => {
    if (emailSubject || emailMessage) {
      localStorage.setItem(
        "prefillContact",
        JSON.stringify({
          subject: emailSubject || `Request to ${actionType}`,
          message: emailMessage || `I'd like to ${actionType}. Here are the details:\n\n`,
        })
      );
    }
    onOpenChange(false);
    navigate("/contact");
  };

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/login");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || `You need to be logged in to ${actionType}. You can log in to continue, or send us a message instead.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="outline" onClick={handleEmailUs}>
            Email Us
          </Button>
          <AlertDialogAction onClick={handleLogin}>
            Log In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthGateDialog;
