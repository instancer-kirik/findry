
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ContentType, Shop, ShopProduct } from '@/types/database';

export function useShop() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the shops table exists by querying it
      const { data, error } = await supabase
        .rpc('get_table_definition', { table_name: 'shops' });

      if (error) {
        throw new Error(`Table 'shops' might not exist: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [] as Shop[];
      }

      // If the table exists, query it
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (shopsError) throw shopsError;
      
      return shops as Shop[];
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
      const { data: tableData, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'shops' });

      if (tableError || !tableData || tableData.length === 0) {
        throw new Error(`Table 'shops' might not exist: ${tableError?.message || 'No table definition found'}`);
      }

      // If the table exists, query it
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

      // Check if the products table exists
      const { data: tableData, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'products' });

      if (tableError || !tableData || tableData.length === 0) {
        throw new Error(`Table 'products' might not exist: ${tableError?.message || 'No table definition found'}`);
      }

      // If the table exists, query it
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as ShopProduct[];
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
      const { data: tableData, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'products' });

      if (tableError || !tableData || tableData.length === 0) {
        throw new Error(`Table 'products' might not exist: ${tableError?.message || 'No table definition found'}`);
      }

      // If the table exists, query it
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
      // Check if content_ownership table exists and contains records for this shop
      const { data, error } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', shopId)
        .eq('content_type', 'shop' as ContentType)
        .eq('owner_id', user.id)
        .single();

      if (error) return false;
      
      return !!data;
    } catch {
      return false;
    }
  };

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
      
      // Insert the shop
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
  
  const { fetchShopById, fetchProductsByShopId, isShopOwner } = useShop();
  const { user } = useAuth();
  
  useEffect(() => {
    async function loadShopDetails() {
      if (!shopId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
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
    }
    
    loadShopDetails();
  }, [shopId, user, fetchShopById, fetchProductsByShopId, isShopOwner]);
  
  return { shop, owner, products, isLoading, error, isOwner };
}
