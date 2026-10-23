import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export type SpaceTool = { id: string; name: string; kind: string | null; category: string | null; location: string | null; owner_name: string | null; quantity: string | null; description?: string | null; params?: Record<string, unknown> | null };
const db = supabase as any;

export function useFloorplanInventory(place?: string) {
  const { user } = useAuth();
  const [tools, setTools] = useState<SpaceTool[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let alive = true;
    setCanEdit(false);
    if (user && place) db.rpc("has_role", { _role: "admin", _user_id: user.id }).then(({ data }: any) => { if (alive) setCanEdit(data === true); });
    return () => { alive = false; };
  }, [user?.id, place]);
  useEffect(() => {
    let alive = true;
    setTools([]); setError(null);
    if (!place) return;
    setLoading(true);
    db.from("space_tools").select("id,name,kind,category,location,owner_name,quantity,description,params").eq("place", place).order("name")
      .then(({ data, error }: any) => { if (alive) { setTools(data ?? []); setError(error?.message ?? null); setLoading(false); } });
    return () => { alive = false; };
  }, [place]);
  const setLocation = async (id: string, location: string | null) => {
    if (!canEdit || saving || !place) return false;
    setSaving(true);
    try {
      const { data, error } = await db.from("space_tools").update({ location }).eq("id", id).eq("place", place).select("id,location").single();
      if (error || !data) { toast.error(error?.message ?? "Location was not saved"); return false; }
      setTools(previous => previous.map(tool => tool.id === id ? { ...tool, location: data.location } : tool));
      toast.success(location ? `Assigned to ${location}` : "Location cleared");
      return true;
    } catch { toast.error("Location was not saved. Try again."); return false; }
    finally { setSaving(false); }
  };
  return { tools, canEdit, loading, error, saving, setLocation };
}