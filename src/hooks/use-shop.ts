
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
        .rpc('table_exists', { schema_name: 'public', table_name: tableName });
      
      if (error) return false;
      return data === true;
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

      // Using rpc to avoid TypeScript errors with table names
      const { data, error: queryError } = await supabase
        .rpc('get_all_shops');

      if (queryError) throw queryError;
      
      return (data || []) as Shop[];
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

      // Using rpc to avoid TypeScript errors with table names
      const { data, error: queryError } = await supabase
        .rpc('get_shop_by_id', { shop_id: shopId });

      if (queryError) throw queryError;
      
      return Array.isArray(data) && data.length > 0 ? data[0] as Shop : null;
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

      // Using rpc to avoid TypeScript errors with table names
      const { data, error: queryError } = await supabase
        .rpc('get_products_by_shop_id', { shop_id: shopId });

      if (queryError) throw queryError;
      
      return (data || []) as ShopProduct[];
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

      // Using rpc to avoid TypeScript errors with table names
      const { data, error: queryError } = await supabase
        .rpc('get_product_by_id', { product_id: productId });

      if (queryError) throw queryError;
      
      return Array.isArray(data) && data.length > 0 ? data[0] as ShopProduct : null;
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

      // Check if user owns the shop using RPC to avoid TypeScript errors
      const { data, error } = await supabase
        .rpc('check_shop_ownership', { 
          shop_id: shopId,
          user_id: user.id
        });

      if (error) return false;
      
      return data === true;
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
      
      // Insert the shop using RPC to avoid TypeScript errors
      const { data: shop, error: shopError } = await supabase
        .rpc('create_shop', {
          shop_name: shopData.name,
          shop_description: shopData.description || null,
          shop_location: shopData.location || null,
          shop_website_url: shopData.website_url || null,
          shop_banner_image_url: shopData.banner_image_url || null,
          shop_logo_url: shopData.logo_url || null,
          shop_tags: shopData.tags || null,
          owner_id: user.id
        });
      
      if (shopError) throw shopError;
      if (!shop) throw new Error('Failed to create shop');
      
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
      
      // Using RPC to avoid TypeScript errors
      const { data, error } = await supabase
        .rpc('delete_product', { product_id: productId });
      
      if (error) throw error;
      
      return data === true;
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

// Custom hook for shop details page
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
