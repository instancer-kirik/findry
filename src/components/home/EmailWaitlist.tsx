import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailWaitlist: React.FC = () => {
  const [email, setEmail] = useState('');
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
    console.log('Attempting to add to waitlist:', email);
    
    try {
      // Now we can use the waitlist table directly since it's defined in the types
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email, source: 'landing_page' }]);
      
      console.log('Supabase response:', { data, error });
      
      if (error) throw error;
      
      toast({
        title: 'Thank you!',
        description: 'You have been added to our waitlist',
      });
      
      setEmail('');
    } catch (error: any) {
      console.error('Error adding to waitlist:', error);
      
      // More detailed error logging
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
      
      toast({
        title: 'Something went wrong',
        description: error.message || 'Failed to join waitlist',
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
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
      </form>
    </div>
  );
};

export default EmailWaitlist;
