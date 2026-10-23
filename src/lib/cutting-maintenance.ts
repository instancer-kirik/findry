import { z } from 'zod';

export const maintenanceLabels = {
  untracked: 'Not tracked', inspect: 'Needs inspection', ready: 'Ready', sharpen: 'Needs sharpening',
  replace: 'Needs replacement', ordered: 'Replacement ordered', out_of_service: 'Out of service',
} as const;
export const maintenanceSchema = z.object({
  status: z.enum(['untracked', 'inspect', 'ready', 'sharpen', 'replace', 'ordered', 'out_of_service']),
  part: z.string().max(300).default(''), notes: z.string().max(2000).default(''),
  replacement_url: z.string().max(2000).refine(v => !v || /^https?:\/\/\S+$/.test(v), 'Replacement link must use HTTP or HTTPS').default(''),
  checked_on: z.string().refine(v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)), 'Invalid inspection date').default(''),
});
export type CuttingMaintenance = z.infer<typeof maintenanceSchema>;
type ToolLike = { name: string; kind?: string | null; params?: Record<string, unknown> | null };

export function cuttingSuggestion(tool: ToolLike): { part: string; notes: string } | null {
  if (tool.kind === 'material') return null;
  const name = tool.name.toLowerCase();
  const specs = 'Confirm model and fitted part dimensions before ordering.';
  if (/shopbot|bridgeport/.test(name)) return { part: 'End mills / cutting bits', notes: `Inspect edges for wear or chips; confirm shank, cutter geometry and material. ${specs}` };
  if (/router/.test(name)) return { part: 'Router bits', notes: `Inspect for dull or chipped carbide, resin buildup and bearing wear. ${specs}` };
  if (/scroll.*saw/.test(name)) return { part: 'Scroll saw blades', notes: `Inspect for dull teeth, broken blades and correct tension; replacement is usually preferable. ${specs}` };
  if (/band\s*saw/.test(name)) return { part: 'Bandsaw blades', notes: `Inspect teeth, cracks and weld; confirm blade length, width and tooth pitch. ${specs}` };
  if (/table\s*saw|miter.*saw/.test(name)) return { part: 'Circular saw blades', notes: `Inspect teeth, carbide tips and plate damage; a qualified service can assess sharpening. ${specs}` };
  if (/planer|jointer/.test(name)) return { part: 'Cutter knives / inserts', notes: `Inspect cutting edges; confirm whether fitted knives can be sharpened or inserts rotated/replaced. ${specs}` };
  if (/lathe/.test(name)) return { part: 'Turning tools / inserts', notes: `Inspect cutting edges; identify HSS tooling versus replaceable carbide inserts. ${specs}` };
  if (/drill/.test(name)) return { part: 'Drill bits', notes: `Inspect dull or chipped tips and straightness; verify size, shank and work material. ${specs}` };
  if (/vinyl cutter/.test(name)) return { part: 'Drag knife blade', notes: `Inspect cut quality and blade tip; confirm holder and blade angle. ${specs}` };
  if (/grinder/.test(name)) return { part: 'Grinding / cutoff wheels', notes: `Replace damaged or worn wheels; do not sharpen them. Verify wheel size, rated speed and intended material. ${specs}` };
  if (/belt sander/.test(name)) return { part: 'Abrasive belts', notes: `Inspect wear, loading and damaged seams; replace rather than sharpen. ${specs}` };
  if (/plasma cutter/.test(name)) return { part: 'Torch electrodes / nozzles', notes: `Inspect consumables against the torch manual; replace rather than sharpen. ${specs}` };
  return null;
}
export function getCuttingMaintenance(tool: ToolLike): CuttingMaintenance & { suggested: boolean } {
  const parsed = maintenanceSchema.safeParse(tool.params?.cutting_maintenance);
  if (parsed.success) return { ...parsed.data, suggested: false };
  const suggestion = cuttingSuggestion(tool);
  return { status: suggestion ? 'inspect' : 'untracked', part: suggestion?.part || '', notes: suggestion?.notes || '', replacement_url: '', checked_on: '', suggested: !!suggestion };
}
export function matchesMaintenance(tool: ToolLike, filter: string) {
  const m = getCuttingMaintenance(tool);
  if (filter === 'all') return true;
  if (filter === 'cutting') return m.status !== 'untracked' || !!cuttingSuggestion(tool);
  if (filter === 'attention') return ['inspect', 'sharpen', 'replace', 'out_of_service'].includes(m.status);
  return m.status === filter;
}