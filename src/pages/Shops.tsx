
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, MapPin } from 'lucide-react';
import { useShop } from '@/hooks/use-shop';
import { useAuth } from '@/hooks/use-auth';
import { Shop } from '@/types/database';

const Shops: React.FC = () => {
  const { user } = useAuth();
  const { fetchShops, loading, error } = useShop();
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const loadShops = async () => {
      const data = await fetchShops();
      setShops(data);
    };

    loadShops();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Shops</h1>
            <p className="text-muted-foreground">Discover and support community shops</p>
          </div>
          {user && (
            <Link to="/shops/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Shop
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="w-full h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded mb-2" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading shops</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Store className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No shops found</h2>
            <p className="text-muted-foreground">Be the first to create a shop in the community</p>
            {user && (
              <Link to="/shops/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Shop
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link key={shop.id} to={`/shops/${shop.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                  <div className="h-48 w-full bg-muted relative">
                    {shop.banner_image_url ? (
                      <img
                        src={shop.banner_image_url}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {shop.logo_url && (
                      <div className="absolute -bottom-10 left-4">
                        <div className="h-20 w-20 rounded-full border-4 border-background overflow-hidden bg-background">
                          <img
                            src={shop.logo_url}
                            alt={`${shop.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className={shop.logo_url ? "pt-10" : ""}>
                    <CardTitle className="line-clamp-1">{shop.name}</CardTitle>
                    {shop.location && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{shop.location}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {shop.description && (
                      <p className="text-muted-foreground line-clamp-3">
                        {shop.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      {shop.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardFooter>
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
