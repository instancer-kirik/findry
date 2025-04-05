
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ContentType } from '@/types/database';
import { Shop, ShopProduct } from '@/types/database';

export function useShop() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using direct query instead of RPC
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

      // Using direct query instead of RPC
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

      // Using direct query instead of RPC
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

      // Using direct query instead of RPC
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
      // Using direct query instead of RPC
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

  const createShop = async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('You must be logged in to create a shop');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Using direct query instead of RPC
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
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('shop_id')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
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
    deleteProduct
  };
}
