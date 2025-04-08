
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';

const EmailWaitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting email to waitlist:', email);
      if (message) {
        console.log('With message:', message);
      }
      
      // Insert the email into Supabase with the message
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email, 
          source: 'landing_page',
          message: message || null
        }]);
      
      if (error) {
        console.error('Error saving to waitlist:', error);
        
        // Handle duplicate emails gracefully
        if (error.code === '23505') { // Unique violation code
          toast({
            title: 'Already subscribed',
            description: 'This email is already on our waitlist',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Thank you!',
          description: 'You have been added to our waitlist',
        });
        setEmail('');
        setMessage('');
      }
    } catch (error: any) {
      console.error('Error saving to waitlist:', error);
      
      toast({
        title: 'Something went wrong',
        description: error.message || 'Failed to join waitlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 rounded-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-2">Join Our Waitlist</h3>
      <p className="text-muted-foreground mb-4">
        Be the first to know when we launch new features and opportunities.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </div>
        
        <Textarea
          placeholder="Share your thoughts or how you'd like to use the platform (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
      </form>
    </div>
  );
}

export default EmailWaitlist;
