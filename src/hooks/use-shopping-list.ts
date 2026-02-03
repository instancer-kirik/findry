import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingListItem } from "@/types/shopping-list";
import { toast } from "@/hooks/use-toast";

export const useGetShoppingList = (includePublic: boolean = true) => {
  return useQuery({
    queryKey: ["shopping-list", includePublic],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // RLS handles visibility: own items, null owner_id (legacy), and is_public items
      const { data, error } = await supabase
        .from("shopping_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ShoppingListItem[];
    },
  });
};

export const useGetCurrentUserId = () => {
  return useQuery({
    queryKey: ["current-user-id"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    },
  });
};

export const useCreateShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<ShoppingListItem, "id" | "created_at" | "updated_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("shopping_list")
        .insert({
          ...item,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShoppingListItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast({
        title: "Item added",
        description: "Shopping list item has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ShoppingListItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("shopping_list")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ShoppingListItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast({
        title: "Item updated",
        description: "Shopping list item has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast({
        title: "Item deleted",
        description: "Shopping list item has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useShoppingList = () => {
  return {
    useGetShoppingList,
    useCreateShoppingListItem,
    useUpdateShoppingListItem,
    useDeleteShoppingListItem,
  };
};
