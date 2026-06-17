import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export type Panel = {
  id: string;
  event_id: string | null;
  title: string;
  blurb: string | null;
  room: string | null;
  starts_at: string;
  duration_min: number;
  capacity: number | null;
  livestream_url: string | null;
  recording_url: string | null;
  status: "draft" | "scheduled" | "live" | "ended" | "cancelled";
  backstage_thread_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PanelSpeaker = {
  id: string;
  panel_id: string;
  user_id: string | null;
  display_name: string | null;
  role: "host" | "speaker" | "moderator";
  position: number;
  bio: string | null;
};

export type PanelQuestion = {
  id: string;
  panel_id: string;
  asked_by: string | null;
  content: string;
  upvotes: number;
  promoted: boolean;
  answered: boolean;
  created_at: string;
};

export function usePanels() {
  return useQuery({
    queryKey: ["panels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("panels" as never)
        .select("*")
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Panel[];
    },
  });
}

export function usePanel(panelId: string | undefined) {
  return useQuery({
    queryKey: ["panel", panelId],
    enabled: !!panelId,
    queryFn: async () => {
      const [panelRes, speakersRes] = await Promise.all([
        supabase.from("panels" as never).select("*").eq("id", panelId!).maybeSingle(),
        supabase.from("panel_speakers" as never).select("*").eq("panel_id", panelId!).order("position"),
      ]);
      if (panelRes.error) throw panelRes.error;
      if (speakersRes.error) throw speakersRes.error;
      return {
        panel: panelRes.data as unknown as Panel | null,
        speakers: (speakersRes.data ?? []) as unknown as PanelSpeaker[],
      };
    },
  });
}

export function usePanelQuestions(panelId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["panel-questions", panelId],
    enabled: !!panelId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("panel_questions" as never)
        .select("*")
        .eq("panel_id", panelId!)
        .order("upvotes", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as PanelQuestion[];
    },
  });

  useEffect(() => {
    if (!panelId) return;
    const channel = supabase
      .channel(`panel-questions-${panelId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "panel_questions", filter: `panel_id=eq.${panelId}` },
        () => qc.invalidateQueries({ queryKey: ["panel-questions", panelId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [panelId, qc]);

  return query;
}

export function useCreatePanel() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Panel> & { title: string; starts_at: string }) => {
      if (!user) throw new Error("Sign in required");
      const { data, error } = await supabase
        .from("panels" as never)
        .insert({
          title: input.title,
          blurb: input.blurb ?? null,
          room: input.room ?? null,
          starts_at: input.starts_at,
          duration_min: input.duration_min ?? 45,
          capacity: input.capacity ?? null,
          livestream_url: input.livestream_url ?? null,
          event_id: input.event_id ?? null,
          created_by: user.id,
        } as never)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Panel;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["panels"] });
      toast({ title: "Panel created" });
    },
    onError: (e: Error) => toast({ title: "Could not create panel", description: e.message, variant: "destructive" }),
  });
}

export function useAskQuestion(panelId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Sign in to ask");
      const { error } = await supabase
        .from("panel_questions" as never)
        .insert({ panel_id: panelId, content, asked_by: user.id } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["panel-questions", panelId] }),
  });
}

export function useUpvoteQuestion(panelId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: PanelQuestion) => {
      const { error } = await supabase
        .from("panel_questions" as never)
        .update({ upvotes: q.upvotes + 1 } as never)
        .eq("id", q.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["panel-questions", panelId] }),
  });
}

export function useRsvpPanel() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ panel_id, status }: { panel_id: string; status: "going" | "interested" | "checked_in" | "cancelled" }) => {
      if (!user) throw new Error("Sign in to RSVP");
      const { error } = await supabase
        .from("panel_attendees" as never)
        .upsert({ panel_id, user_id: user.id, status } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["panels"] }),
  });
}