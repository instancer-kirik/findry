
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ResourceDetails, parseAvailabilityFromJson, formatAvailabilityToJson } from '@/types/resource';
import { ContentType } from '@/types/database';

export function useResource() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert availability from JSON to ResourceAvailability
      const resources: ResourceDetails[] = data.map(resource => ({
        ...resource,
        availability: parseAvailabilityFromJson(resource.availability)
      }));

      return resources;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching resources'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceById = async (resourceId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;

      // Convert availability from JSON to ResourceAvailability
      const resource: ResourceDetails = {
        ...data,
        availability: parseAvailabilityFromJson(data.availability)
      };

      return resource;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching resource'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isResourceOwner = async (resourceId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', resourceId)
        .eq('content_type', 'resource')
        .eq('owner_id', user.id)
        .single();

      if (error) return false;

      return !!data;
    } catch {
      return false;
    }
  };

  // Update the createResource function to handle JSON conversion
  const createResource = async (resourceData: Omit<ResourceDetails, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('You must be logged in to create a resource');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format availability for database storage
      const formattedData = {
        ...resourceData,
        availability: resourceData.availability ? formatAvailabilityToJson(resourceData.availability) : null
      };
      
      // Create resource
      const { data: resource, error: resourceError } = await supabase
        .from('resources')
        .insert(formattedData)
        .select()
        .single();
      
      if (resourceError) throw resourceError;
      
      // Create content ownership
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: resource.id,
          content_type: 'resource',
          owner_id: user.id,
        });
      
      if (ownershipError) throw ownershipError;
      
      // Parse availability from database format
      const resourceDetails: ResourceDetails = {
        ...resource,
        availability: parseAvailabilityFromJson(resource.availability)
      };
      
      return resourceDetails;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating resource'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add this helper function to convert database resource to ResourceDetails
  const convertToResourceDetails = (resource: any): ResourceDetails => {
    return {
      ...resource,
      availability: parseAvailabilityFromJson(resource.availability)
    };
  };

  return {
    loading,
    error,
    fetchResources,
    fetchResourceById,
    isResourceOwner,
    createResource,
    convertToResourceDetails
  };
}

export const useResources = () => {
  const [resources, setResources] = useState<ResourceDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const resourceService = useResource();

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await resourceService.fetchResources();
      setResources(data);
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return { resources, isLoading, error, refetch: fetchResources };
};

export const useResourceDetails = (resourceId: string | undefined) => {
  const [resource, setResource] = useState<ResourceDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const resourceService = useResource();
  const { user } = useAuth();

  const fetchResourceDetails = async () => {
    if (!resourceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const resourceData = await resourceService.fetchResourceById(resourceId);
      if (!resourceData) {
        throw new Error("Resource not found");
      }

      setResource(resourceData);

      if (user) {
        setIsOwner(await resourceService.isResourceOwner(resourceId));
      }
    } catch (err: any) {
      console.error('Error fetching resource details:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId, user]);

  return { resource, isLoading, error, isOwner, refetch: fetchResourceDetails };
};
