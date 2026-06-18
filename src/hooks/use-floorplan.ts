import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const db: any = supabase;

export type FloorplanItemKind =
  | "booth" | "table" | "wall" | "pedestal" | "stage" | "seating"
  | "tent" | "truck" | "path" | "entrance" | "power" | "signage" | "misc";

export type ClaimMode = "organizer" | "open" | "hybrid";
export type AssignmentStatus = "assigned" | "pending_claim" | "confirmed" | "declined";

export interface Floorplan {
  id: string;
  event_id: string | null;
  venue_id: string | null;
  title: string;
  description: string | null;
  canvas: { width: number; height: number; units: "ft" | "m"; background?: string | null };
  claim_mode: ClaimMode;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FloorplanItem {
  id: string;
  floorplan_id: string;
  kind: FloorplanItemKind;
  label: string | null;
  x: number; y: number; w: number; h: number;
  rotation: number; z: number;
  meta: Record<string, any>;
}

export interface FloorplanAssignment {
  id: string;
  item_id: string;
  status: AssignmentStatus;
  assigned_user_id: string | null;
  project_id: string | null;
  panel_id: string | null;
  ugc_id: string | null;
  note: string | null;
}

export function useFloorplanList() {
  const [plans, setPlans] = useState<Floorplan[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from("venue_floorplans").select("*").order("created_at", { ascending: false });
    setPlans(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { plans, loading, refresh };
}

export function useFloorplan(floorplanId: string | undefined) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Floorplan | null>(null);
  const [items, setItems] = useState<FloorplanItem[]>([]);
  const [assignments, setAssignments] = useState<FloorplanAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!floorplanId) return;
    setLoading(true);
    const [p, i, a] = await Promise.all([
      db.from("venue_floorplans").select("*").eq("id", floorplanId).maybeSingle(),
      db.from("floorplan_items").select("*").eq("floorplan_id", floorplanId).order("created_at"),
      db.from("floorplan_assignments").select("*, floorplan_items!inner(floorplan_id)").eq("floorplan_items.floorplan_id", floorplanId),
    ]);
    setPlan(p.data ?? null);
    setItems(i.data ?? []);
    setAssignments((a.data ?? []).map((r: any) => ({
      id: r.id, item_id: r.item_id, status: r.status,
      assigned_user_id: r.assigned_user_id, project_id: r.project_id,
      panel_id: r.panel_id, ugc_id: r.ugc_id, note: r.note,
    })));
    setLoading(false);
  }, [floorplanId]);

  useEffect(() => { refresh(); }, [refresh]);

  // realtime: item + assignment changes
  useEffect(() => {
    if (!floorplanId) return;
    const channel = supabase
      .channel(`floorplan_${floorplanId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "floorplan_items", filter: `floorplan_id=eq.${floorplanId}` }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "floorplan_assignments" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [floorplanId, refresh]);

  const isOwner = !!(plan && user && plan.created_by === user.id);

  const addItem = async (patch: Partial<FloorplanItem> & { kind: FloorplanItemKind }) => {
    if (!floorplanId) return;
    const { data } = await db.from("floorplan_items").insert({
      floorplan_id: floorplanId,
      kind: patch.kind,
      label: patch.label ?? null,
      x: patch.x ?? 100, y: patch.y ?? 100,
      w: patch.w ?? 60, h: patch.h ?? 60,
      rotation: patch.rotation ?? 0, z: patch.z ?? 30,
      meta: patch.meta ?? {},
    }).select("*").single();
    if (data) setItems((prev) => [...prev, data]);
  };

  const updateItem = async (id: string, patch: Partial<FloorplanItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } as FloorplanItem : it)));
    await db.from("floorplan_items").update(patch).eq("id", id);
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    await db.from("floorplan_items").delete().eq("id", id);
  };

  const claimItem = async (itemId: string, note?: string) => {
    if (!user) return { error: "Sign in to claim a spot" };
    const { error } = await db.from("floorplan_assignments").insert({
      item_id: itemId, status: "pending_claim", assigned_user_id: user.id, note: note ?? null,
    });
    if (!error) refresh();
    return { error: error?.message };
  };

  const setAssignmentStatus = async (id: string, status: AssignmentStatus) => {
    await db.from("floorplan_assignments").update({ status }).eq("id", id);
    refresh();
  };

  const assignUser = async (itemId: string, assignedUserId: string, note?: string) => {
    await db.from("floorplan_assignments").insert({
      item_id: itemId, status: "assigned", assigned_user_id: assignedUserId, note: note ?? null,
    });
    refresh();
  };

  return {
    plan, items, assignments, loading, isOwner,
    addItem, updateItem, removeItem, claimItem, setAssignmentStatus, assignUser, refresh,
  };
}

export async function createFloorplan(input: {
  title: string; description?: string; event_id?: string | null;
  claim_mode?: ClaimMode; canvas?: Floorplan["canvas"]; is_public?: boolean;
  created_by: string;
}) {
  const { data, error } = await db.from("venue_floorplans").insert({
    title: input.title,
    description: input.description ?? null,
    event_id: input.event_id ?? null,
    claim_mode: input.claim_mode ?? "organizer",
    canvas: input.canvas ?? { width: 1000, height: 600, units: "ft" },
    is_public: input.is_public ?? true,
    created_by: input.created_by,
  }).select("*").single();
  if (error) throw error;
  return data as Floorplan;
}