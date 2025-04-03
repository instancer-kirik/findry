import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Store, 
  MapPin, 
  ExternalLink, 
  ShoppingCart, 
  Share2, 
  Heart, 
  Tag,
  Calendar,
  User,
  ChevronLeft
} from 'lucide-react';

interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
}

interface ShopOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

interface ShopDetails {
  id: string;
  name: string;
  description: string;
  location: string;
  website_url: string;
  banner_image_url: string;
  logo_url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  owner: ShopOwner;
  products: ShopProduct[];
}

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('products');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShopDetails = async () => {
      setIsLoading(true);
      try {
        if (!id) return;

        // Get the shop details
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', id)
          .single();

        if (shopError) throw shopError;

        // Get the owner details
        const { data: ownershipData, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('owner_id')
          .eq('content_id', id)
          .eq('content_type', 'shop')
          .single();

        if (ownershipError) throw ownershipError;

        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', ownershipData.owner_id)
          .single();

        if (ownerError) throw ownerError;

        // Get products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Combine all the data
        const fullShopData: ShopDetails = {
          ...shopData,
          owner: ownerData,
          products: productsData || []
        };

        setShop(fullShopData);

        // Check if current user is the owner
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsOwner(user.id === ownerData.id);
        }

      } catch (error: any) {
        console.error('Error fetching shop details:', error);
        toast({
          title: 'Error loading shop',
          description: error.message || 'Failed to load shop details',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-full bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <p className="mb-4">The shop you're looking for doesn't exist or has been removed.</p>
        <Link to="/discover">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Discover
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Back Navigation */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/discover">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Discover
          </Link>
        </Button>
      </div>

      {/* Banner Image */}
      <div 
        className="w-full h-48 md:h-64 rounded-lg bg-cover bg-center mb-6" 
        style={{ 
          backgroundImage: shop.banner_image_url 
            ? `url(${shop.banner_image_url})` 
            : 'linear-gradient(to right, #4f46e5, #6366f1)'
        }}
      >
        {/* Logo Avatar overlapping the banner */}
        <div className="relative top-[75%] left-6">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={shop.logo_url} alt={shop.name} />
            <AvatarFallback>
              <Store className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Shop Info Section */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-12">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{shop.location}</span>
            {shop.website_url && (
              <>
                <span className="mx-2">•</span>
                <a 
                  href={shop.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </a>
              </>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">{shop.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {shop.tags && shop.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Owner Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Shop Owner</h2>
            <Link to={`/profile/${shop.owner.username}`} className="flex items-center hover:bg-accent p-2 rounded-md">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={shop.owner.avatar_url} alt={shop.owner.full_name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{shop.owner.full_name}</p>
                <p className="text-sm text-muted-foreground">@{shop.owner.username}</p>
              </div>
            </Link>
          </div>
          
          <Separator className="my-6" />
          
          {/* Established Date */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Established {new Date(shop.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Shop Actions */}
        <div className="md:w-1/3 space-y-4">
          {isOwner && (
            <Button className="w-full" asChild>
              <Link to={`/shop/${id}/edit`}>
                Edit Shop
              </Link>
            </Button>
          )}
          
          {isOwner && (
            <Button className="w-full" variant="outline" asChild>
              <Link to={`/shop/${id}/products/new`}>
                <Tag className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
          
          <Button className="w-full" variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View All Products
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-10">
        <Tabs defaultValue="products" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            {shop.products.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                <p className="text-muted-foreground">
                  This shop hasn't added any products yet.
                </p>
                {isOwner && (
                  <Button className="mt-4" asChild>
                    <Link to={`/shop/${id}/products/new`}>
                      Add Your First Product
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shop.products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <Link to={`/shop/${id}/products/${product.id}`}>
                      <div 
                        className="h-48 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${product.image_url || '/placeholder-product.png'})` }}
                      />
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">{product.category}</Badge>
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* About Tab */}
          <TabsContent value="about">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">About {shop.name}</h2>
              <div className="prose max-w-none">
                <p>{shop.description}</p>
                {/* Add more detailed about information here */}
              </div>
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No reviews yet.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDetail; 