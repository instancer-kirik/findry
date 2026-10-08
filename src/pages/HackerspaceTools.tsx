import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Trash2, Save, Pencil, X } from "lucide-react";

const PLACE = "Baltimore Hackerspace";
const SOURCE = "https://baltimorehackerspace.com/2025/06/tools-and-equipment/";

type Tool = {
  id: string; place: string; kind: string; category: string; name: string;
  description: string | null; details: string[]; links: string[];
  location: string | null; owner_name: string | null; quantity: string | null;
  training_required: boolean; params: Record<string, unknown>; sort_order: number;
};

const db = supabase as any;
const lines = (s: string) => s.split("\n").map(x => x.trim()).filter(Boolean);

const HackerspaceTools = () => {
  const { user } = useAuth() as any;
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await db.from("space_tools").select("*").eq("place", PLACE).order("sort_order");
    if (error) toast.error(error.message); else setTools(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    db.rpc("has_role", { _role: "admin", _user_id: user.id }).then(({ data }: any) => setIsAdmin(!!data));
  }, [user]);

  const cats = useMemo(() => Array.from(new Set(tools.map(t => t.category))), [tools]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tools.filter(t => (!cat || t.category === cat) && (!s ||
      [t.name, t.description, t.location, t.owner_name, ...t.details].some(v => (v ?? "").toLowerCase().includes(s))));
  }, [tools, q, cat]);

  const addTool = async () => {
    const { data, error } = await db.from("space_tools").insert({
      place: PLACE, name: "New item", category: cat ?? "General",
      sort_order: (tools.at(-1)?.sort_order ?? 0) + 1,
    }).select().single();
    if (error) return toast.error(error.message);
    setTools(t => [...t, data]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <p className="text-sm text-muted-foreground">Baltimore, MD</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold mt-1">{PLACE}: tools & materials</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant={editMode ? "default" : "outline"} size="sm" onClick={() => setEditMode(e => !e)}>
                <Pencil className="w-4 h-4 mr-1" />{editMode ? "Done editing" : "Edit list"}
              </Button>
              {editMode && <Button size="sm" onClick={addTool}><Plus className="w-4 h-4 mr-1" />Add item</Button>}
            </div>
          )}
        </div>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          {tools.length} items. Tools belong to individual members, not the space. Some need a short one-on-one training before use.
        </p>
        <div className="mt-3 flex gap-3 text-sm">
          <a href={SOURCE} target="_blank" rel="noreferrer" className="text-primary underline">Original list</a>
          <Link to="/floorplans" className="text-primary underline">Place big tools on a floorplan</Link>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Input placeholder="Search name, owner, location, details" value={q} onChange={e => setQ(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={cat ? "outline" : "default"} onClick={() => setCat(null)}>All</Button>
            {cats.map(c => (
              <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>
                {c} <span className="ml-1 opacity-60">{tools.filter(t => t.category === c).length}</span>
              </Button>
            ))}
          </div>
        </div>

        {loading ? <p className="mt-8 text-muted-foreground">Loading…</p> : editMode ? (
          <div className="mt-8 space-y-3">
            {filtered.map(t => (
              <ToolEditor key={t.id} tool={t}
                onSaved={n => setTools(ts => ts.map(x => x.id === n.id ? n : x))}
                onDeleted={id => setTools(ts => ts.filter(x => x.id !== id))} />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {cats.filter(c => !cat || c === cat).map(c => {
              const items = filtered.filter(t => t.category === c);
              if (!items.length) return null;
              return (
                <section key={c}>
                  <h2 className="text-xl font-semibold mb-3">{c}</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(t => <ToolCard key={t.id} t={t} />)}
                  </div>
                </section>
              );
            })}
            {!filtered.length && <p className="text-muted-foreground">Nothing matches.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

const ToolCard = ({ t }: { t: Tool }) => (
  <Card className="p-4 flex flex-col">
    <div className="flex items-start justify-between gap-2">
      <h3 className="font-medium">{t.name}</h3>
      {t.kind === "material" && <Badge variant="secondary" className="text-xs">Material</Badge>}
    </div>
    {t.description && <p className="mt-1 text-sm">{t.description}</p>}
    {t.details.length > 0 && (
      <ul className="mt-2 text-sm text-muted-foreground list-disc pl-4 space-y-0.5">
        {t.details.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    )}
    {t.links.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {t.links.map((l, i) => <a key={i} href={l} target="_blank" rel="noreferrer" className="text-primary underline">Link {i + 1}</a>)}
      </div>
    )}
    <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
      {t.kind !== "material" && (
        <Badge variant="outline" className="text-xs">{t.owner_name ? `Owned by ${t.owner_name}` : "Member-owned · owner not listed"}</Badge>
      )}
      {t.location && <Badge variant="outline" className="text-xs">📍 {t.location}</Badge>}
      {t.quantity && <Badge variant="outline" className="text-xs">Qty {t.quantity}</Badge>}
      {t.training_required && <Badge className="text-xs">Training required</Badge>}
      {Object.entries(t.params ?? {}).map(([k, v]) => (
        <Badge key={k} variant="outline" className="text-xs">{k}: {String(v)}</Badge>
      ))}
    </div>
  </Card>
);

const ToolEditor = ({ tool, onSaved, onDeleted }: { tool: Tool; onSaved: (t: Tool) => void; onDeleted: (id: string) => void }) => {
  const [f, setF] = useState({
    ...tool,
    detailsText: tool.details.join("\n"),
    linksText: tool.links.join("\n"),
    paramsText: Object.entries(tool.params ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n"),
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim()) return toast.error("Name can't be empty");
    const params: Record<string, string> = {};
    lines(f.paramsText).forEach(l => { const i = l.indexOf(":"); if (i > 0) params[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    setSaving(true);
    const { data, error } = await db.from("space_tools").update({
      name: f.name.trim().slice(0, 200), category: f.category.trim() || "General", kind: f.kind,
      description: f.description?.trim() || null, location: f.location?.trim() || null,
      owner_name: f.owner_name?.trim() || null, quantity: f.quantity?.trim() || null,
      training_required: f.training_required, details: lines(f.detailsText),
      links: lines(f.linksText).filter(l => /^https?:\/\//.test(l)), params, sort_order: Number(f.sort_order) || 0,
    }).eq("id", tool.id).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    onSaved(data); toast.success("Saved");
  };
  const remove = async () => {
    if (!confirm(`Delete "${tool.name}"?`)) return;
    const { error } = await db.from("space_tools").delete().eq("id", tool.id);
    if (error) return toast.error(error.message);
    onDeleted(tool.id);
  };

  return (
    <Card className="p-4 grid gap-3 md:grid-cols-4">
      <Field label="Name"><Input value={f.name} onChange={e => set("name", e.target.value)} /></Field>
      <Field label="Category"><Input value={f.category} onChange={e => set("category", e.target.value)} /></Field>
      <Field label="Owner"><Input value={f.owner_name ?? ""} placeholder="Member name" onChange={e => set("owner_name", e.target.value)} /></Field>
      <Field label="Location"><Input value={f.location ?? ""} placeholder="e.g. Wood shop, shelf B" onChange={e => set("location", e.target.value)} /></Field>
      <Field label="Description" className="md:col-span-2"><Textarea rows={2} value={f.description ?? ""} onChange={e => set("description", e.target.value)} /></Field>
      <Field label="Details (one per line)" className="md:col-span-2"><Textarea rows={2} value={f.detailsText} onChange={e => set("detailsText", e.target.value)} /></Field>
      <Field label="Settings (key: value per line)" className="md:col-span-2"><Textarea rows={2} placeholder={"voltage: 240V\nbed: 24x30 in"} value={f.paramsText} onChange={e => set("paramsText", e.target.value)} /></Field>
      <Field label="Links (one per line)" className="md:col-span-2"><Textarea rows={2} value={f.linksText} onChange={e => set("linksText", e.target.value)} /></Field>
      <Field label="Quantity"><Input value={f.quantity ?? ""} onChange={e => set("quantity", e.target.value)} /></Field>
      <Field label="Type">
        <div className="flex gap-1">
          {["tool", "material"].map(k => (
            <Button key={k} type="button" size="sm" variant={f.kind === k ? "default" : "outline"} onClick={() => set("kind", k)}>{k}</Button>
          ))}
        </div>
      </Field>
      <Field label="Training required"><Switch checked={f.training_required} onCheckedChange={v => set("training_required", v)} /></Field>
      <Field label="Order"><Input type="number" value={f.sort_order} onChange={e => set("sort_order", e.target.value)} /></Field>
      <div className="md:col-span-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={remove}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
        <Button size="sm" onClick={save} disabled={saving}><Save className="w-4 h-4 mr-1" />{saving ? "Saving…" : "Save"}</Button>
      </div>
    </Card>
  );
};

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <label className={`flex flex-col gap-1 text-xs text-muted-foreground ${className}`}>{label}{children}</label>
);

export default HackerspaceTools;
