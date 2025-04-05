
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useShop } from '@/hooks/use-shop';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Store } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateShop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createShop, checkIfTableExists } = useShop();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkTable = async () => {
      const exists = await checkIfTableExists('shops');
      setTableExists(exists);
    };
    
    checkTable();
  }, [checkIfTableExists]);
  
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
    
    if (!tableExists) {
      toast({
        title: 'Shop functionality not available',
        description: 'Shop creation is currently in development. Please try again later.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.name.trim()) {
      toast({
        title: 'Shop name required',
        description: 'Please enter a name for your shop',
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
        
        {tableExists === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Shop Creation Not Available</AlertTitle>
            <AlertDescription>
              The shop creation feature is currently in development. Please check back later.
            </AlertDescription>
          </Alert>
        )}
        
        {tableExists === true && !user && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in to create a shop.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shop Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your shop name"
                  disabled={isSubmitting || tableExists === false || !user}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your shop"
                  disabled={isSubmitting || tableExists === false || !user}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Shop location"
                  disabled={isSubmitting || tableExists === false || !user}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://your-website.com"
                  disabled={isSubmitting || tableExists === false || !user}
                  type="url"
                />
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  variant="default"
                  disabled={isSubmitting || tableExists === false || !user}
                >
                  {isSubmitting ? 'Creating...' : 'Create Shop'}
                </Button>
                
                {tableExists === false && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Shop creation is currently in development
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateShop;
