import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export type GameActivity = "tennis" | "dnd" | "racing" | "fighting" | "other";
export type GameMatchStatus = "open" | "full" | "confirmed" | "live" | "completed" | "cancelled";
export type GameParticipantRole = "host" | "player" | "spectator" | "dungeon_master" | "referee";

export type GameMatch = {
  id: string;
  host_id: string;
  title: string;
  activity: GameActivity;
  game_title: string | null;
  format: string | null;
  skill_level: string | null;
  starts_at: string;
  duration_min: number;
  timezone: string | null;
  location: string | null;
  platform: string | null;
  lobby_url: string | null;
  max_players: number;
  status: GameMatchStatus;
  notes: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type GameMatchParticipant = {
  id: string;
  match_id: string;
  user_id: string;
  display_name: string | null;
  role: GameParticipantRole;
  status: "joined" | "waitlist" | "declined" | "no_show";
  result: string | null;
  score: number | null;
};

export const ACTIVITY_LABELS: Record<GameActivity, string> = {
  tennis: "Tennis",
  dnd: "D&D / Tabletop",
  racing: "Online Racing",
  fighting: "Fighting Games",
  other: "Other",
};

export function useGameMatches() {
  return useQuery({
    queryKey: ["game-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_matches" as never)
        .select("*")
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as GameMatch[];
    },
  });
}

export function useGameMatchParticipants() {
  return useQuery({
    queryKey: ["game-match-participants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_match_participants" as never)
        .select("*");
      if (error) throw error;
      return (data ?? []) as unknown as GameMatchParticipant[];
    },
  });
}

export function useCreateGameMatch() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<GameMatch> & { title: string; starts_at: string }) => {
      if (!user) throw new Error("Sign in required");
      const { data, error } = await supabase
        .from("game_matches" as never)
        .insert({
          host_id: user.id,
          title: input.title,
          activity: input.activity ?? "other",
          game_title: input.game_title || null,
          format: input.format || null,
          skill_level: input.skill_level || null,
          starts_at: input.starts_at,
          duration_min: input.duration_min ?? 60,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          location: input.location || null,
          platform: input.platform || null,
          lobby_url: input.lobby_url || null,
          max_players: input.max_players ?? 2,
          notes: input.notes || null,
          is_public: input.is_public ?? true,
        } as never)
        .select()
        .single();
      if (error) throw error;
      const match = data as unknown as GameMatch;
      await supabase
        .from("game_match_participants" as never)
        .insert({ match_id: match.id, user_id: user.id, role: "host" } as never);
      return match;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["game-matches"] });
      qc.invalidateQueries({ queryKey: ["game-match-participants"] });
      toast({ title: "Match scheduled" });
    },
    onError: (e: Error) =>
      toast({ title: "Could not schedule match", description: e.message, variant: "destructive" }),
  });
}

export function useJoinGameMatch() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, role }: { matchId: string; role?: GameParticipantRole }) => {
      if (!user) throw new Error("Sign in to join");
      const { error } = await supabase
        .from("game_match_participants" as never)
        .insert({ match_id: matchId, user_id: user.id, role: role ?? "player" } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["game-match-participants"] });
      toast({ title: "You're in" });
    },
    onError: (e: Error) => toast({ title: "Could not join", description: e.message, variant: "destructive" }),
  });
}

export function useLeaveGameMatch() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase
        .from("game_match_participants" as never)
        .delete()
        .eq("match_id", matchId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["game-match-participants"] }),
  });
}

export function useCancelGameMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from("game_matches" as never)
        .update({ status: "cancelled" } as never)
        .eq("id", matchId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["game-matches"] });
      toast({ title: "Match cancelled" });
    },
  });
}