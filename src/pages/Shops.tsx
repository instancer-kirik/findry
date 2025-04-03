import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Store,
  Search,
  MapPin,
  Plus,
  ShoppingBag
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  logo_url: string;
  tags: string[];
  updated_at: string;
}

const Shops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Fetch all shops
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setShops(data || []);
      } catch (error: any) {
        console.error('Error fetching shops:', error);
        toast({
          title: 'Error loading shops',
          description: error.message || 'Failed to load shops',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [toast]);

  // Filter shops based on search query
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shop.tags && shop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shops</h1>
            <p className="text-muted-foreground">Discover artist shops, products, and services</p>
          </div>
          {currentUser && (
            <Button className="mt-4 sm:mt-0" asChild>
              <Link to="/shops/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Shop
              </Link>
            </Button>
          )}
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search shops by name, description, location, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-2">No Shops Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Shops will appear here once created'}
            </p>
            {currentUser && (
              <Button asChild>
                <Link to="/shops/create">Create Your Shop</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Link to={`/shops/${shop.id}`} key={shop.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={shop.logo_url} alt={shop.name} />
                        <AvatarFallback>
                          <Store className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shop.location}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {shop.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {shop.tags && shop.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {shop.tags && shop.tags.length > 3 && (
                        <Badge variant="outline">+{shop.tags.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shops; 