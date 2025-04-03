import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Store, Tag, ShoppingCart, Globe } from 'lucide-react';
import { 
  getTandemXProducts, 
  getTandemXShopInfo, 
  TandemXProduct, 
  TandemXShopInfo 
} from '@/integrations/tandemx';

const TandemXShop: React.FC = () => {
  const [products, setProducts] = useState<TandemXProduct[]>([]);
  const [shopInfo, setShopInfo] = useState<TandemXShopInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, shopInfoData] = await Promise.all([
          getTandemXProducts(),
          getTandemXShopInfo()
        ]);
        
        setProducts(productsData);
        setShopInfo(shopInfoData);
      } catch (error) {
        console.error('Error fetching TandemX data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Shop Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mr-2">External Shop Integration</h1>
              <Badge variant="outline" className="ml-2">
                <Globe className="h-3 w-3 mr-1" />
                External
              </Badge>
            </div>
            <Button variant="outline" asChild>
              <a 
                href="https://0.0.0.0:8000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Original Shop
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">
            This page demonstrates integration with an external shop at tandemx.fly.dev
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Shop Info */}
            {shopInfo && (
              <div className="bg-card rounded-lg overflow-hidden mb-10 border shadow-sm">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${shopInfo.banner_url})` }}
                ></div>
                <div className="p-6 relative">
                  <div className="absolute -top-12 left-6">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={shopInfo.logo_url} alt={shopInfo.name} />
                      <AvatarFallback>
                        <Store className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-2">{shopInfo.name}</h2>
                    <p className="text-muted-foreground mb-4">{shopInfo.description}</p>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={shopInfo.owner.avatar_url} alt={shopInfo.owner.name} />
                        <AvatarFallback>{shopInfo.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{shopInfo.owner.name}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{shopInfo.product_count} products</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <Link to="/shops">
                  <Button variant="outline">
                    <Store className="h-4 w-4 mr-2" />
                    View All Shops
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${product.image_url})` }}></div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg line-clamp-2">{product.name}</h3>
                        <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        <Badge variant="outline">{product.category}</Badge>
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge variant="outline" key={tag}>
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" size="sm" asChild>
                        <a 
                          href={`https://tandemx.fly.dev/products/${product.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          View Product
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Integration Notes */}
            <div className="bg-muted/20 rounded-lg p-6 mt-10">
              <h2 className="text-xl font-bold mb-2">About This Integration</h2>
              <Separator className="my-4" />
              <p className="mb-4">
                This page demonstrates how Findry can integrate with external shops like TandemX.
                Artists and creators can connect their existing shops to their Findry profile.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Benefits for Shop Owners:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Showcase your existing shop to the Findry community</li>
                    <li>Single dashboard to manage your online presence</li>
                    <li>Reach new customers and collaborate with other artists</li>
                    <li>Keep your existing shop infrastructure and workflows</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Integration Features:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Product listings and details</li>
                    <li>Shop branding and information</li>
                    <li>Direct links to purchase on the original platform</li>
                    <li>Unified product discovery across multiple platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TandemXShop; 