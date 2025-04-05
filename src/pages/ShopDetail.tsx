
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useShopDetails } from '@/hooks/use-shop';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shop, products, isLoading, error, isOwner, loadShopDetails } = useShopDetails(id);
  
  useEffect(() => {
    loadShopDetails();
  }, [id]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-40 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !shop) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
            <p className="text-muted-foreground">The shop you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="bg-muted/20 rounded-lg overflow-hidden mb-8">
          {shop.banner_image_url ? (
            <img 
              src={shop.banner_image_url} 
              alt={shop.name} 
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground">No banner image</span>
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            
            {shop.description && (
              <p className="mt-2 text-muted-foreground">{shop.description}</p>
            )}
            
            {shop.location && (
              <div className="mt-2">
                <span className="text-muted-foreground">Location: {shop.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Products</h2>
            
            {isOwner && (
              <Link to={`/shops/${shop.id}/products/create`}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
          
          {products.length === 0 ? (
            <div className="text-center p-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No products available in this shop yet.</p>
              
              {isOwner && (
                <Link to={`/shops/${shop.id}/products/create`}>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link to={`/shops/${shop.id}/products/${product.id}`} key={product.id}>
                  <div className="bg-card shadow hover:shadow-md transition-shadow rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="h-48 relative">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-background rounded-full px-3 py-1 text-sm font-medium">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                      
                      {product.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    {product.category && (
                      <div className="px-4 pb-4">
                        <span className="inline-block bg-muted px-2 py-1 rounded-full text-xs">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopDetail;
