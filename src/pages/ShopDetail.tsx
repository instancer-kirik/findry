import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useShopDetails } from '@/hooks/use-shop';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shop, owner, products, isLoading, error, isOwner } = useShopDetails(id);
  
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
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center p-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No products available in this shop yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-card shadow rounded-lg overflow-hidden">
                  {/* Product card content would go here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopDetail;
