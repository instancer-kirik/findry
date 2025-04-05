import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/layout/Layout';
import {
  ChevronLeft,
  Store,
  MapPin,
  ShoppingCart,
  Share2,
  Heart,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shop, ShopProduct } from "@/types/database";

interface ShopOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

const ProductDetail: React.FC = () => {
  const { shopId, productId } = useParams<{ shopId: string; productId: string }>();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [owner, setOwner] = useState<ShopOwner | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        if (!shopId || !productId) return;

        const productResult = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productResult.error) throw productResult.error;
        setProduct(productResult.data as unknown as ShopProduct);
        
        const shopResult = await supabase
          .from('shops')
          .select('*')
          .eq('id', productResult.data.shop_id)
          .single();
        
        if (shopResult.error) throw shopResult.error;
        setShop(shopResult.data as unknown as Shop);
        
        if (user) {
          const ownershipResult = await supabase
            .from('content_ownership')
            .select('*')
            .eq('content_id', shopResult.data.id)
            .eq('content_type', 'shop')
            .eq('owner_id', user.id)
            .single();
          
          setIsOwner(!ownershipResult.error);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        toast({
          title: 'Error loading product',
          description: 'Failed to load product details. Please try again later.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [shopId, productId, toast]);

  const handleDeleteProduct = async () => {
    try {
      if (!productId) return;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
      });

      navigate(`/shops/${shopId}`);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting product',
        description: error.message || 'Failed to delete the product',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
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
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to={`/shops/${shopId}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6 text-sm">
          <Link to="/shops" className="text-muted-foreground hover:text-foreground">
            Shops
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link to={`/shops/${shopId}`} className="text-muted-foreground hover:text-foreground">
            {shop.name}
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium truncate">{product.name}</span>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="bg-muted/20 rounded-lg overflow-hidden h-80 md:h-96 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="mb-2">
                  {product.category && (
                    <Badge variant="outline">{product.category}</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                {product.description || 'No description provided.'}
              </p>
            </div>

            {/* Shop Info */}
            <div className="mb-6">
              <Link to={`/shops/${shopId}`} className="flex items-center hover:bg-accent p-2 rounded-md">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={shop.logo_url} alt={shop.name} />
                  <AvatarFallback>
                    <Store className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{shop.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {shop.location}
                  </div>
                </div>
              </Link>
            </div>

            {/* Actions */}
            <div className="space-y-4 mt-8">
              {isOwner ? (
                <div className="flex gap-4">
                  <Button asChild className="w-full">
                    <Link to={`/shops/${shopId}/products/${productId}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Product
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this product from your shop.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <Button className="w-full" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              
              <Button asChild variant="outline" className="w-full">
                <Link to={`/shops/${shopId}`}>
                  <Store className="h-4 w-4 mr-2" />
                  View Shop
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
