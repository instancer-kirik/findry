import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export type Bot = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  kind: "assistant" | "scheduled" | "moderator";
  system_prompt: string;
  model: string;
  config: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export function useMyBots() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-bots", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bots" as never)
        .select("*")
        .or(`owner_id.eq.${user!.id},is_public.eq.true`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Bot[];
    },
  });
}

export function useCreateBot() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string; kind: Bot["kind"]; system_prompt: string; is_public?: boolean }) => {
      if (!user) throw new Error("Sign in required");
      const { data, error } = await supabase
        .from("bots" as never)
        .insert({
          owner_id: user.id,
          name: input.name,
          description: input.description ?? null,
          kind: input.kind,
          system_prompt: input.system_prompt,
          is_public: input.is_public ?? false,
        } as never)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Bot;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bots"] });
      toast({ title: "Bot created" });
    },
    onError: (e: Error) => toast({ title: "Could not create bot", description: e.message, variant: "destructive" }),
  });
}

export function useThreadBots(threadId: string | undefined) {
  return useQuery({
    queryKey: ["thread-bots", threadId],
    enabled: !!threadId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("thread_bots" as never)
        .select("*, bot:bots(*)")
        .eq("thread_id", threadId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAttachBotToThread(threadId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bot_id: string) => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase
        .from("thread_bots" as never)
        .insert({ thread_id: threadId, bot_id, added_by: user.id, enabled: true } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["thread-bots", threadId] }),
  });
}