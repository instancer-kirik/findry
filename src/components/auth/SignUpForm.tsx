import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema with Zod
const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      termsAccepted: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });
      
      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Generate a unique username
      const baseUsername = values.name.toLowerCase().replace(/\s+/g, '_');
      let username = baseUsername;
      let counter = 1;
      let isUnique = false;

      // Try to find a unique username
      while (!isUnique) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (existingUser) {
          username = `${baseUsername}_${counter}`;
          counter++;
        } else {
          isUnique = true;
        }
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username,
            full_name: values.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }
      
      // Check if email verification is required
      if (authData.user.identities?.length === 0) {
        toast({
          title: 'Verification email sent!',
          description: 'Please check your email to verify your account before logging in.',
        });
        navigate('/login');
      } else {
        // Show success toast
        toast({
          title: 'Account created!',
          description: 'Welcome to Findry. Please complete your profile setup.',
        });
        
        // Navigate to profile completion page
        navigate('/profile-setup?wizard=true');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Please try again later.';
      if (error.message) {
        if (error.message.includes('email already registered')) {
          errorMessage = 'This email is already registered. Please log in instead.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Password must be at least 8 characters long.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I accept the <Link to="/terms" className="text-primary underline">terms and conditions</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
