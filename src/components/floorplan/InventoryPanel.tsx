import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import type { SpaceTool } from "@/hooks/use-floorplan-inventory";

export function InventoryPanel({ tools, loading, error, canEdit, saving, target, onAssign, onDrag }: {
  tools: SpaceTool[]; loading?: boolean; error?: string | null; canEdit: boolean; saving: boolean;
  target?: string | null; onAssign: (id: string) => void;
  onDrag?: (event: React.PointerEvent, tool: SpaceTool) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const query = search.trim().toLowerCase();
  const results = tools.filter(tool => (filter === "all" || (filter === "unassigned" ? !tool.location : tool.kind === filter)) &&
    (!query || [tool.name, tool.category, tool.location, tool.owner_name, tool.description].some(value => value?.toLowerCase().includes(query))));
  return <div className="space-y-2">
    <Input aria-label="Search zone inventory" placeholder="Search tools & materials" value={search} onChange={event => setSearch(event.target.value)} />
    <select aria-label="Inventory type" className="h-10 w-full rounded-md border bg-background px-2 text-xs" value={filter} onChange={event => setFilter(event.target.value)}>
      <option value="all">All inventory ({tools.length})</option><option value="unassigned">Without a location</option><option value="tool">Tools</option><option value="material">Materials</option>
    </select>
    {target && <p className="break-words text-xs font-medium text-primary">{target}</p>}
    {loading ? <p className="text-xs text-muted-foreground">Loading inventory…</p> : error ? <p role="alert" className="text-xs text-destructive">{error}</p> : <ul className="divide-y border-y">
      {results.map(tool => <li key={tool.id} className="flex items-center gap-1 py-2">
        {onDrag && <Button variant="ghost" size="icon" className="h-11 w-9 shrink-0 touch-none cursor-grab" disabled={!canEdit || saving} aria-label={`Drag ${tool.name} to zone`} title={`Drag ${tool.name} to zone`} onPointerDown={event => onDrag(event, tool)}><GripVertical className="h-4 w-4" /></Button>}
        <div className="min-w-0 flex-1"><p className="break-words text-xs font-medium">{tool.name}{tool.quantity ? ` ×${tool.quantity}` : ""}</p><p className="break-words text-[11px] text-muted-foreground">{[tool.kind, tool.category, tool.location || "No location"].filter(Boolean).join(" · ")}</p></div>
        <Button variant="ghost" size="icon" className="h-11 w-9 shrink-0" disabled={!canEdit || saving || !target || tool.location === target} aria-label={`Add ${tool.name} to selected zone`} title={`Add to ${target || "selected zone"}`} onClick={() => onAssign(tool.id)}><Plus className="h-4 w-4" /></Button>
      </li>)}
      {!results.length && <li className="py-3 text-xs text-muted-foreground">Nothing matches.</li>}
    </ul>}
  </div>;
}