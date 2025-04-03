
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BrandDetails } from '@/types/brand';

export const useBrand = (brandId?: string) => {
  const [isOwner, setIsOwner] = useState(false);

  const fetchBrand = async (): Promise<BrandDetails | null> => {
    if (!brandId) return null;

    // Fetch brand data
    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching brand:', error);
      return null;
    }

    // Check if the user is the owner
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data: ownership } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', brandId)
        .eq('content_type', 'brand')
        .eq('owner_id', session.session.user.id)
        .single();

      setIsOwner(!!ownership);
    }

    return brand;
  };

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: fetchBrand,
    enabled: !!brandId
  });

  return {
    brand,
    isLoading,
    error,
    isOwner
  };
};
