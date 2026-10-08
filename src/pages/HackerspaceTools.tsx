import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Trash2, Save, Pencil, Undo2, ChevronDown } from "lucide-react";

const PLACE = "Baltimore Hackerspace";
const HACKERSPACE_FLOORPLAN_ID = "617b20a6-8edf-4218-a6b4-ed6cfca9f749";
const SOURCE = "https://baltimorehackerspace.com/2025/06/tools-and-equipment/";

type Tool = {
  id: string; place: string; kind: string; category: string; name: string;
  description: string | null; details: string[]; links: string[];
  location: string | null; owner_name: string | null; quantity: string | null;
  training_required: boolean; params: Record<string, unknown>; sort_order: number;
};

const db = supabase as any;
const lines = (s: string) => s.split("\n").map(x => x.trim()).filter(Boolean);

const CAT_COLOR: Record<string, string> = {
  "Automotive": "amber",
  "Carpentry": "emerald",
  "CNC Tools": "cyan",
  "Electrical": "yellow",
  "General": "slate",
  "Machinist Tools": "violet",
  "Metalworking": "rose",
  "Miscellaneous": "neutral",
  "Stock / materials": "blue",
};
const catDot = (c: string) => `cat-dot cat-${CAT_COLOR[c] ?? "neutral"}`;

const HackerspaceTools = () => {
  const { user } = useAuth() as any;
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCat = (c: string) => setCollapsed(p => {
    const n = new Set(p);
    if (n.has(c)) n.delete(c); else n.add(c);
    return n;
  });

  const load = async () => {
    const { data, error } = await db.from("space_tools").select("*").eq("place", PLACE).order("sort_order");
    if (error) toast.error(error.message); else setTools(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const [zones, setZones] = useState<string[]>([]);
  useEffect(() => {
    db.from("floorplan_items").select("label").eq("floorplan_id", HACKERSPACE_FLOORPLAN_ID)
      .or("kind.eq.booth,meta->>object_type.eq.room_zone")
      .then(({ data }: any) => setZones([...new Set<string>((data ?? []).map((d: any) => d.label).filter(Boolean))]));
  }, []);
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
            <Button size="sm" variant={cat ? "outline" : "default"} onClick={() => setCat(null)}>
              All <span className="ml-1 opacity-60">{tools.length}</span>
            </Button>
            {cats.map(c => (
              <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>
                <span className={catDot(c)} />
                {c} <span className="ml-1 opacity-60">{tools.filter(t => t.category === c).length}</span>
              </Button>
            ))}
          </div>
        </div>

        {loading ? <p className="mt-8 text-muted-foreground">Loading…</p> : editMode ? (
          <div className="mt-6 max-h-[70vh] overflow-auto rounded-md border bg-background">
            <datalist id="hackerspace-zones">{zones.map(z => <option key={z} value={z} />)}</datalist>
            <table className="w-full min-w-[2200px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  {["Name", "Type", "Category", "Owner", "Location", "Quantity", "Description", "Details", "Parameters (JSON)", "Links", "Training", "Order", "Actions"].map((label, i) => (
                    <th key={label} scope="col" className={`sticky top-0 border-b bg-muted px-3 py-3 text-left text-xs font-medium text-muted-foreground ${i === 0 ? "left-0 z-30 min-w-[240px] border-r" : "z-20"} ${label === "Actions" ? "right-0 border-l" : ""}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <ToolEditor key={t.id} tool={t}
                    onSaved={n => setTools(ts => ts.map(x => x.id === n.id ? n : x))}
                    onDeleted={id => setTools(ts => ts.filter(x => x.id !== id))} />
                ))}
                {!filtered.length && <tr><td colSpan={13} className="p-6 text-muted-foreground">Nothing matches.</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {cats.filter(c => !cat || c === cat).map(c => {
              const items = filtered.filter(t => t.category === c);
              if (!items.length) return null;
              const isCollapsed = collapsed.has(c);
              return (
                <section key={c}>
                  <button
                    type="button"
                    onClick={() => toggleCat(c)}
                    aria-expanded={!isCollapsed}
                    className="mb-3 flex w-full items-center gap-2 text-left"
                  >
                    <span className={catDot(c)} />
                    <span className="text-xl font-semibold">{c}</span>
                    <span className="text-sm text-muted-foreground">{items.length}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
                  </button>
                  {!isCollapsed && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map(t => <ToolCard key={t.id} t={t} />)}
                    </div>
                  )}
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

const toolDraft = (tool: Tool) => ({
    ...tool,
    detailsText: tool.details.join("\n"),
    linksText: tool.links.join("\n"),
    paramsText: JSON.stringify(tool.params ?? {}),
  });

const ToolEditor = ({ tool, onSaved, onDeleted }: { tool: Tool; onSaved: (t: Tool) => void; onDeleted: (id: string) => void }) => {
  const [f, setF] = useState(() => toolDraft(tool));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(f) !== JSON.stringify(toolDraft(tool));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim()) return toast.error("Name can't be empty");
    let params: Record<string, unknown>;
    try {
      const parsed = JSON.parse(f.paramsText || "{}");
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      params = parsed;
    } catch {
      return toast.error(`Parameters for "${f.name}" must be a JSON object`);
    }
    if (lines(f.linksText).some(l => !/^https?:\/\//.test(l))) return toast.error("Links must start with https:// or http://");
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
    setF(toolDraft(data)); onSaved(data); toast.success(`Saved ${data.name}`);
  };
  const remove = async () => {
    if (!confirm(`Delete "${tool.name}"?`)) return;
    setDeleting(true);
    const { error } = await db.from("space_tools").delete().eq("id", tool.id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    onDeleted(tool.id);
  };

  const cell = "border-b p-2 align-top";
  const input = "h-9 min-w-[150px] rounded-sm border-transparent bg-transparent shadow-none hover:border-input focus-visible:border-input";
  const area = `${input} min-h-9 min-w-[240px] resize-y`;
  const label = (field: string) => `${field} for ${tool.name}`;

  return (
    <tr className={dirty ? "bg-accent/30" : "bg-background"} aria-label={tool.name}>
      <td className={`${cell} sticky left-0 z-10 border-r bg-background`}>
        <div className="flex items-start gap-2">
          <span className={`${catDot(f.category)} mt-3.5`} />
          <div>
            <Input aria-label={label("Name")} className={`${input} min-w-[220px] font-medium`} value={f.name} onChange={e => set("name", e.target.value)} disabled={saving || deleting} />
            {dirty && <span className="px-3 text-xs text-primary">Unsaved</span>}
          </div>
        </div>
      </td>
      <td className={cell}>
        <Select value={f.kind} onValueChange={v => set("kind", v)}>
          <SelectTrigger aria-label={label("Type")} className={`${input} min-w-[120px]`}><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="tool">Tool</SelectItem><SelectItem value="material">Material</SelectItem></SelectContent>
        </Select>
      </td>
      <td className={cell}><Input aria-label={label("Category")} className={input} value={f.category} onChange={e => set("category", e.target.value)} /></td>
      <td className={cell}><Input aria-label={label("Owner")} className={input} value={f.owner_name ?? ""} placeholder="—" onChange={e => set("owner_name", e.target.value)} /></td>
      <td className={cell}><Input aria-label={label("Location")} className={input} list="hackerspace-zones" value={f.location ?? ""} placeholder="Zone or text" onChange={e => set("location", e.target.value)} /></td>
      <td className={cell}><Input aria-label={label("Quantity")} className={`${input} min-w-[90px]`} value={f.quantity ?? ""} placeholder="—" onChange={e => set("quantity", e.target.value)} /></td>
      <td className={cell}><Textarea aria-label={label("Description")} className={area} rows={2} value={f.description ?? ""} onChange={e => set("description", e.target.value)} /></td>
      <td className={cell}><Textarea aria-label={label("Details")} title="One detail per line" className={area} rows={2} value={f.detailsText} onChange={e => set("detailsText", e.target.value)} /></td>
      <td className={cell}><Textarea aria-label={label("Parameters")} className={`${area} font-mono text-xs`} rows={2} value={f.paramsText} onChange={e => set("paramsText", e.target.value)} /></td>
      <td className={cell}><Textarea aria-label={label("Links")} title="One link per line" className={area} rows={2} value={f.linksText} onChange={e => set("linksText", e.target.value)} /></td>
      <td className={`${cell} text-center`}><Switch aria-label={label("Training required")} className="mt-2" checked={f.training_required} onCheckedChange={v => set("training_required", v)} /></td>
      <td className={cell}><Input aria-label={label("Order")} className={`${input} min-w-[80px] w-20`} type="number" value={f.sort_order} onChange={e => set("sort_order", Number(e.target.value))} /></td>
      <td className={`${cell} sticky right-0 z-10 border-l bg-background`}>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" title={`Save ${tool.name}`} aria-label={`Save ${tool.name}`} onClick={save} disabled={!dirty || saving || deleting}><Save className={`h-4 w-4 ${saving ? "animate-pulse" : ""}`} /></Button>
          <Button variant="ghost" size="icon" title={`Revert ${tool.name}`} aria-label={`Revert ${tool.name}`} onClick={() => setF(toolDraft(tool))} disabled={!dirty || saving || deleting}><Undo2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" title={`Delete ${tool.name}`} aria-label={`Delete ${tool.name}`} onClick={remove} disabled={saving || deleting}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </td>
    </tr>
  );
};

export default HackerspaceTools;
