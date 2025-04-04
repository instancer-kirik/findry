import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useShop } from '@/hooks/use-shop';

const CreateShop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createShop } = useShop();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a shop',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const shop = await createShop({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        website_url: formData.website_url,
        banner_image_url: null,
        logo_url: null,
        tags: []
      });
      
      toast({
        title: 'Shop created',
        description: 'Your shop has been created successfully'
      });
      
      // Navigate to the shop page
      navigate(`/shops/${shop.id}`);
    } catch (error: any) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error creating shop',
        description: error.message || 'An error occurred while creating the shop',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create a New Shop</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl">
          {/* Form fields would go here */}
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateShop;
