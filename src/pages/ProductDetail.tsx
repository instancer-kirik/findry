
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

// Define correct interface for product to match ShopProduct
interface Product extends ShopProduct {}

const ProductDetail: React.FC = () => {
  const { shopId, productId } = useParams<{ shopId: string; productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch product and shop data
  useEffect(() => {
    const fetchData = async () => {
      if (!shopId || !productId) {
        setError('Invalid shop or product ID');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch product data
        const { data: productData, error: productError } = await (supabase
          .from('products') as any)
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        setProduct(productData as Product);

        // Check if product belongs to the shop
        if (productData.shop_id !== shopId) {
          throw new Error("Product doesn't belong to this shop");
        }

        // Fetch shop data
        const { data: shopData, error: shopError } = await (supabase
          .from('shops') as any)
          .select('*')
          .eq('id', shopId)
          .single();

        if (shopError) throw shopError;
        setShop(shopData as Shop);

        // Check if user is owner
        if (user) {
          const { data: ownerData, error: ownerError } = await supabase
            .from('content_ownership')
            .select('*')
            .eq('content_id', shopId)
            .eq('content_type', 'shop')
            .eq('owner_id', user.id)
            .single();

          setIsOwner(!!ownerData && !ownerError);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product details');
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shopId, productId, user]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await (supabase
        .from('products') as any)
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted',
      });

      // Redirect to shop page
      window.location.href = `/shops/${shopId}`;
    } catch (err) {
      console.error('Error deleting product:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-28 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product || !shop) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error || 'Product or shop not found'}</p>
          <Button asChild className="mt-4">
            <Link to="/shops">Back to Shops</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link to={`/shops/${shopId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>
          
          {isOwner && (
            <div className="ml-auto space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/shops/${shopId}/products/${productId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover aspect-square"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted aspect-square">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
              {product.category && (
                <span className="ml-4 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                  {product.category}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description || 'No description available'}</p>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2">Shop</h2>
              <Link 
                to={`/shops/${shopId}`}
                className="text-primary hover:underline flex items-center"
              >
                {shop.logo_url && (
                  <img src={shop.logo_url} alt={shop.name} className="w-6 h-6 rounded-full mr-2" />
                )}
                {shop.name}
              </Link>
            </div>

            <Button className="w-full">Contact Seller</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
