
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
import { ArrowRight, Loader2 } from 'lucide-react';
import ProfileTypeSelector from './ProfileTypeSelector';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema with Zod
const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  profileType: z.array(z.string()).min(1, { message: 'Select at least one profile type' }),
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
      profileType: ['user'], // Default to 'user' profile type
      termsAccepted: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Signup values:', values);
      
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            profile_types: values.profileType,
          },
        },
      });
      
      if (authError) {
        throw authError;
      }

      // If successful, create profile in profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: values.name.toLowerCase().replace(/\s+/g, '_'),
              full_name: values.name,
              profile_types: values.profileType,
              role_attributes: {},
            },
          ]);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
      
      // Show success toast
      toast({
        title: 'Account created!',
        description: 'Welcome to Findry. Please complete your profile setup.',
      });
      
      // Navigate to profile completion page
      setTimeout(() => {
        navigate('/profile-setup?wizard=true');
      }, 1500);
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Please try again later.';
      if (error.message) {
        errorMessage = error.message;
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
          name="profileType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am (select all that apply)</FormLabel>
              <FormControl>
                <ProfileTypeSelector 
                  value={field.value} 
                  onChange={field.onChange} 
                />
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
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">
            Log in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
