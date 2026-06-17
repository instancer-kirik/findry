import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export type Thread = {
  id: string;
  kind: "direct" | "group" | "panel_backstage" | "panel_qa" | "community";
  title: string | null;
  created_by: string;
  context_type: string | null;
  context_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ThreadMessage = {
  id: string;
  thread_id: string;
  sender_kind: "user" | "bot" | "system";
  sender_user_id: string | null;
  sender_bot_id: string | null;
  content: string;
  attachments: unknown;
  metadata: unknown;
  created_at: string;
};

export function useMyThreads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-threads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: members, error: mErr } = await supabase
        .from("thread_members" as never)
        .select("thread_id")
        .eq("user_id", user!.id);
      if (mErr) throw mErr;
      const ids = (members ?? []).map((m: { thread_id: string }) => m.thread_id);
      if (ids.length === 0) return [] as Thread[];
      const { data, error } = await supabase
        .from("threads" as never)
        .select("*")
        .in("id", ids)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Thread[];
    },
  });
}

export function useThread(threadId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["thread", threadId],
    enabled: !!threadId,
    queryFn: async () => {
      const [threadRes, msgsRes, memRes] = await Promise.all([
        supabase.from("threads" as never).select("*").eq("id", threadId!).maybeSingle(),
        supabase
          .from("thread_messages" as never)
          .select("*")
          .eq("thread_id", threadId!)
          .order("created_at", { ascending: true })
          .limit(500),
        supabase.from("thread_members" as never).select("*").eq("thread_id", threadId!),
      ]);
      if (threadRes.error) throw threadRes.error;
      if (msgsRes.error) throw msgsRes.error;
      if (memRes.error) throw memRes.error;
      return {
        thread: threadRes.data as unknown as Thread | null,
        messages: (msgsRes.data ?? []) as unknown as ThreadMessage[],
        members: (memRes.data ?? []) as unknown as { user_id: string; role: string }[],
      };
    },
  });

  useEffect(() => {
    if (!threadId) return;
    const channel = supabase
      .channel(`thread-msgs-${threadId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "thread_messages", filter: `thread_id=eq.${threadId}` },
        () => qc.invalidateQueries({ queryKey: ["thread", threadId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, qc]);

  return query;
}

export function useCreateThread() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; kind?: Thread["kind"] }) => {
      if (!user) throw new Error("Sign in required");
      const { data, error } = await supabase
        .from("threads" as never)
        .insert({ title: input.title, kind: input.kind ?? "group", created_by: user.id } as never)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Thread;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-threads"] }),
    onError: (e: Error) => toast({ title: "Could not create thread", description: e.message, variant: "destructive" }),
  });
}

export function useSendMessage(threadId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Sign in to chat");
      const { error } = await supabase
        .from("thread_messages" as never)
        .insert({
          thread_id: threadId,
          sender_kind: "user",
          sender_user_id: user.id,
          content,
        } as never);
      if (error) throw error;
      // Trigger bot dispatch (fire-and-forget)
      supabase.functions.invoke("bot-dispatch", { body: { thread_id: threadId } }).catch(() => {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["thread", threadId] }),
  });
}

export function useAddThreadMember(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user_id: string) => {
      const { error } = await supabase
        .from("thread_members" as never)
        .insert({ thread_id: threadId, user_id, role: "member" } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["thread", threadId] }),
  });
}