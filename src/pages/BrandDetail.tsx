
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBrand } from '@/hooks/use-brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Tag, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { brand, isLoading, error, isOwner } = useBrand(brandId);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !brand) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Brand not found</h2>
                <p className="text-muted-foreground mt-2">
                  The brand you're looking for doesn't exist or you don't have permission to view it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Mock data for the brand's products and collaborations
  const mockProducts = [
    { id: '1', name: 'Premium Sound System', description: 'High-fidelity audio equipment for professionals', price: 1299, image: '/placeholder.svg' },
    { id: '2', name: 'Studio Microphone', description: 'Professional grade condenser microphone', price: 399, image: '/placeholder.svg' },
    { id: '3', name: 'MIDI Controller', description: 'Precision control for digital music production', price: 249, image: '/placeholder.svg' },
  ];

  const mockCollaborations = [
    { id: '1', title: 'Summer Festival Series', type: 'Event', date: '2025-07-15', image: '/placeholder.svg' },
    { id: '2', title: 'Artist Development Program', type: 'Project', status: 'Ongoing', image: '/placeholder.svg' },
    { id: '3', title: 'Music Production Workshop', type: 'Event', date: '2025-05-20', image: '/placeholder.svg' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Brand Banner */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            {brand.image_url ? (
              <img
                src={brand.image_url}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white">{brand.name}</h1>
              </div>
            )}
          </div>

          {/* Brand Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl">{brand.name}</CardTitle>
                      {brand.type && (
                        <CardDescription>
                          <Badge variant="outline" className="mt-2">
                            {brand.type}
                          </Badge>
                        </CardDescription>
                      )}
                    </div>
                    {isOwner && (
                      <Button variant="outline">Edit Brand</Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Location and Website */}
                    <div className="flex flex-col gap-2">
                      {brand.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{brand.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {brand.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-muted-foreground">{brand.description}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {brand.tags && brand.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {brand.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Brand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Reach out for collaborations or inquiries
                  </p>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  {/* Additional information */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Connect with us</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Visit website</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products and Collaborations */}
          <Separator className="my-4" />
          <h2 className="text-2xl font-bold mt-4">Brand Showcase</h2>
          
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <Card key={product.id}>
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="text-lg font-bold text-primary">
                        ${product.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{product.description}</p>
                      <Button variant="outline" className="w-full mt-4">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="collaborations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCollaborations.map((collab) => (
                  <Card key={collab.id}>
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={collab.image} 
                        alt={collab.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{collab.title}</CardTitle>
                        <Badge>{collab.type}</Badge>
                      </div>
                      <CardDescription>
                        {collab.date ? `Date: ${collab.date}` : `Status: ${collab.status}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BrandDetail;
