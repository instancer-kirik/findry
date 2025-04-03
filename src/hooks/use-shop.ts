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
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Shop[];
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
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();
      
      if (error) throw error;
      
      return data as Shop;
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
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as ShopProduct[];
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
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      
      return data as ShopProduct;
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
      const { data, error } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', shopId)
        .eq('content_type', 'shop')
        .eq('owner_id', user.id)
        .single();
      
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
      
      // Create shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert(shopData)
        .select()
        .single();
      
      if (shopError) throw shopError;
      
      // Create content ownership
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: shop.id,
          content_type: 'shop',
          owner_id: user.id,
        });
      
      if (ownershipError) throw ownershipError;
      
      return shop as Shop;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating shop'));
      throw err;
    } finally {
      setLoading(false);
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
    createShop
  };
}

export interface ShopOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

// Temporary function to check if tables exist - remove when tables are created
const checkIfTableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Try querying the table
    const { error } = await supabase
      .from(tableName as any)
      .select('id')
      .limit(1);
    
    // If there was an error, the table might not exist
    if (error && error.message.includes("relation") && error.message.includes("does not exist")) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchShops = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the table exists
      const tableExists = await checkIfTableExists('shops');
      if (!tableExists) {
        throw new Error("The shops table doesn't exist yet. Please create it first.");
      }
      
      // Use type assertion to handle type incompatibility
      const { data, error } = await supabase
        .from('shops' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setShops(data as any || []);
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

  const fetchShopDetails = async () => {
    if (!shopId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the tables exist
      const shopsExist = await checkIfTableExists('shops');
      const productsExist = await checkIfTableExists('products');
      
      if (!shopsExist) {
        throw new Error("The shops table doesn't exist yet. Please create it first.");
      }
      
      // Get shop details
      const { data: shopData, error: shopError } = await supabase
        .from('shops' as any)
        .select('*')
        .eq('id', shopId)
        .single();

      if (shopError) throw shopError;
      
      setShop(shopData as any);
      
      // Try to get owner details
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
            
            // Check if current user is owner
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              setIsOwner(user.id === ownerData.id);
            }
          }
        }
      } catch (ownerError) {
        console.warn('Could not fetch shop owner:', ownerError);
        // Continue even if we can't get owner info
      }
      
      // Get products if the table exists
      if (productsExist) {
        const { data: productsData, error: productsError } = await supabase
          .from('products' as any)
          .select('*')
          .eq('shop_id', shopId)
          .order('created_at', { ascending: false });
        
        if (!productsError) {
          setProducts(productsData as any || []);
        }
      }
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
  }, [shopId]);

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

  const fetchProductDetails = async () => {
    if (!shopId || !productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if table exists
      const tableExists = await checkIfTableExists('products');
      if (!tableExists) {
        throw new Error("The products table doesn't exist yet. Please create it first.");
      }
      
      const { data, error } = await supabase
        .from('products' as any)
        .select('*')
        .eq('id', productId)
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      
      setProduct(data as any);
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
