
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ShopProduct, Shop, ContentType } from '@/types/database';
import { useShop } from '@/hooks/use-shop';

const ProductDetail: React.FC = () => {
  const { shopId, productId } = useParams<{ shopId: string; productId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchProductById, fetchShopById, isShopOwner, deleteProduct } = useShop();
  
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        // Fetch product
        const productData = await fetchProductById(productId);
        if (!productData) {
          throw new Error("Product not found");
        }
        
        setProduct(productData);
        
        // Get shop data
        if (productData.shop_id) {
          const shopData = await fetchShopById(productData.shop_id);
          if (!shopData) {
            throw new Error("Shop not found");
          }
          
          setShop(shopData);
          
          // Check if user is the shop owner
          if (user) {
            const ownerStatus = await isShopOwner(shopData.id);
            setIsOwner(ownerStatus);
          }
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, shopId, user, fetchProductById, fetchShopById, isShopOwner]);
  
  const handleDeleteProduct = async () => {
    if (!user || !product) return;
    
    try {
      setIsDeleting(true);
      
      await deleteProduct(product.id);
      
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted',
      });
      
      navigate(`/shops/${product.shop_id}`);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting product',
        description: error.message || 'An error occurred while deleting the product',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product || !shop) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground">This product doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate(`/shops/${shopId}`)} 
              className="mt-4"
            >
              Return to Shop
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/shops/${shopId}`)}
          >
            ← Back to {shop.name}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.image_url ? (
              <div className="rounded-lg overflow-hidden h-80">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted h-80 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="text-2xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}
            
            {product.category && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <Button className="w-full">Add to Cart</Button>
              <Button variant="outline" className="w-full">Buy Now</Button>
            </div>
            
            {isOwner && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Shop Owner Actions</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline">Edit Product</Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteProduct}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Product'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
