
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ContentType, Shop, ShopProduct } from '@/types/database';

export function useShop() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to check if a table exists
  const checkIfTableExists = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_table_definition', { table_name: tableName });
      
      if (error) return false;
      return data && data.length > 0;
    } catch {
      return false;
    }
  };

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the shops table exists
      const shopsExist = await checkIfTableExists('shops');
      if (!shopsExist) {
        return [] as Shop[];
      }

      // Using raw query to avoid TypeScript errors
      const { data, error: queryError } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Shop[] | null, error: any };

      if (queryError) throw queryError;
      
      return data as Shop[] || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching shops'));
      return [] as Shop[];
    } finally {
      setLoading(false);
    }
  };

  const fetchShopById = async (shopId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if the shops table exists
      const shopsExist = await checkIfTableExists('shops');
      if (!shopsExist) {
        return null;
      }

      // Using raw query to avoid TypeScript errors
      const { data, error: queryError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single() as { data: Shop | null, error: any };

      if (queryError) throw queryError;
      
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

      // Check if the products table exists
      const productsExist = await checkIfTableExists('products');
      if (!productsExist) {
        return [] as ShopProduct[];
      }

      // Using raw query to avoid TypeScript errors
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false }) as { data: ShopProduct[] | null, error: any };

      if (queryError) throw queryError;
      
      return data as ShopProduct[] || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching products'));
      return [] as ShopProduct[];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if the products table exists
      const productsExist = await checkIfTableExists('products');
      if (!productsExist) {
        return null;
      }

      // Using raw query to avoid TypeScript errors
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single() as { data: ShopProduct | null, error: any };

      if (queryError) throw queryError;
      
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
      // Check if table exists
      const ownershipExists = await checkIfTableExists('content_ownership');
      if (!ownershipExists) return false;

      // Check if user owns the shop
      const { data, error } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', shopId)
        .eq('content_type', 'shop')
        .eq('owner_id', user.id)
        .single() as { data: any, error: any };

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
      
      // Check if shops table exists
      const shopsExist = await checkIfTableExists('shops');
      if (!shopsExist) {
        throw new Error('Shop creation is currently not available as the required tables are not set up yet.');
      }

      // Check if content_ownership table exists
      const ownershipExists = await checkIfTableExists('content_ownership');
      if (!ownershipExists) {
        throw new Error('Shop creation is currently not available as the required tables are not set up yet.');
      }
      
      // Insert the shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert(shopData)
        .select()
        .single() as { data: Shop | null, error: any };
      
      if (shopError) throw shopError;
      if (!shop) throw new Error('Failed to create shop');
      
      // Create content ownership
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: shop.id,
          content_type: 'shop' as ContentType,
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

  const deleteProduct = async (productId: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete a product');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // First check if the product exists and get its shop_id
      const product = await fetchProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Check if user is the shop owner
      const isOwner = await isShopOwner(product.shop_id);
      
      if (!isOwner) {
        throw new Error('You do not have permission to delete this product');
      }
      
      // Delete the product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error deleting product'));
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
    createShop,
    deleteProduct,
    checkIfTableExists
  };
}

// Create a custom hook for shop details page
export function useShopDetails(shopId: string | undefined) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  const { fetchShopById, fetchProductsByShopId, isShopOwner, checkIfTableExists } = useShop();
  const { user } = useAuth();
  
  const loadShopDetails = async () => {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if required tables exist
      const shopsExist = await checkIfTableExists('shops');
      if (!shopsExist) {
        throw new Error("Shop feature is not available yet");
      }
      
      // Fetch shop
      const shopData = await fetchShopById(shopId);
      if (!shopData) {
        throw new Error("Shop not found");
      }
      setShop(shopData);
      
      // Fetch products
      const productsData = await fetchProductsByShopId(shopId);
      setProducts(productsData || []);
      
      // Check if current user is owner
      if (user) {
        const ownerStatus = await isShopOwner(shopId);
        setIsOwner(ownerStatus);
      }
      
      // TODO: Fetch owner data if needed
      
    } catch (err: any) {
      console.error("Error loading shop details:", err);
      setError(err.message || "Failed to load shop details");
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    shop, 
    owner, 
    products, 
    isLoading, 
    error, 
    isOwner,
    loadShopDetails 
  };
}
