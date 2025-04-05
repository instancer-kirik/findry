import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { Shop, ShopProduct, ContentType } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useShop() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_all_shops');
        
        if (error) throw error;
        
        return data as Shop[];
      } catch (err) {
        console.error('Error accessing shops:', err);
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching shops'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchShopById = async (shopId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_shop_by_id', { 
          shop_id: shopId 
        });
        
        if (error) throw error;
        
        return data as Shop;
      } catch (err) {
        console.error('Error accessing shop details:', err);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching shop'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByShopId = async (shopId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_products_by_shop_id', {
          shop_id: shopId
        });
        
        if (error) throw error;
        
        return data as ShopProduct[];
      } catch (err) {
        console.error('Error accessing products:', err);
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching products'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_product_by_id', {
          product_id: productId
        });
        
        if (error) throw error;
        
        return data as ShopProduct;
      } catch (err) {
        console.error('Error accessing product details:', err);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching product'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isShopOwner = async (shopId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('check_shop_ownership', {
        shop_id: shopId,
        user_id: user.id
      });
      
      if (error) return false;
      
      return !!data;
    } catch {
      return false;
    }
  };

  const createShop = async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('You must be logged in to create a shop');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: shop, error: shopError } = await supabase.rpc('create_shop', {
          shop_name: shopData.name,
          shop_description: shopData.description,
          shop_location: shopData.location,
          shop_website_url: shopData.website_url,
          shop_banner_image_url: shopData.banner_image_url,
          shop_logo_url: shopData.logo_url,
          shop_tags: shopData.tags,
          owner_id: user.id
        });
        
        if (shopError) throw shopError;
        
        return shop as Shop;
      } catch (err) {
        console.error('Error creating shop:', err);
        throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating shop'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkIfTableExists = async (tableName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('get_table_definition', {
        table_name: tableName
      });
      
      if (error) {
        console.error('Error checking if table exists:', error);
        return false;
      }
      
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error('Error checking if table exists:', error);
      return false;
    }
  };

  return {
    loading,
    error,
    fetchShops,
    fetchShopById,
    fetchProductsByShopId,
    fetchProductById,
    isShopOwner,
    createShop,
    checkIfTableExists
  };
}

export interface ShopOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const shopService = useShop();

  const fetchShops = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await shopService.fetchShops();
      setShops(data);
    } catch (err: any) {
      console.error('Error fetching shops:', err);
      setError(err.message);
      toast({
        title: 'Failed to load shops',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return { shops, isLoading, error, refetch: fetchShops };
};

export const useShopDetails = (shopId: string | undefined) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [owner, setOwner] = useState<ShopOwner | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { toast } = useToast();
  const shopService = useShop();
  const { user } = useAuth();

  const fetchShopDetails = async () => {
    if (!shopId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const shopData = await shopService.fetchShopById(shopId);
      if (!shopData) {
        throw new Error("Shop not found");
      }
      
      setShop(shopData);
      
      try {
        const { data: ownershipData, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('owner_id')
          .eq('content_id', shopId)
          .eq('content_type', 'shop' as ContentType)
          .single();
        
        if (!ownershipError && ownershipData) {
          const { data: ownerData, error: ownerError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', ownershipData.owner_id)
            .single();
          
          if (!ownerError && ownerData) {
            setOwner(ownerData as ShopOwner);
            
            if (user) {
              setIsOwner(user.id === ownerData.id);
            }
          }
        }
      } catch (ownerError) {
        console.warn('Could not fetch shop owner:', ownerError);
      }
      
      const productsData = await shopService.fetchProductsByShopId(shopId);
      setProducts(productsData);
    } catch (err: any) {
      console.error('Error fetching shop details:', err);
      setError(err.message);
      toast({
        title: 'Failed to load shop details',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId, user]);

  return { 
    shop, 
    owner, 
    products, 
    isLoading, 
    error, 
    isOwner,
    refetch: fetchShopDetails 
  };
};

export const useProductDetails = (shopId: string | undefined, productId: string | undefined) => {
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const shopService = useShop();

  const fetchProductDetails = async () => {
    if (!shopId || !productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const productData = await shopService.fetchProductById(productId);
      if (!productData) {
        throw new Error("Product not found");
      }
      
      if (productData.shop_id !== shopId) {
        throw new Error("Product doesn't belong to the specified shop");
      }
      
      setProduct(productData);
    } catch (err: any) {
      console.error('Error fetching product details:', err);
      setError(err.message);
      toast({
        title: 'Failed to load product',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shopId && productId) {
      fetchProductDetails();
    }
  }, [shopId, productId]);

  return { product, isLoading, error, refetch: fetchProductDetails };
};
