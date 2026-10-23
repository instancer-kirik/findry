import { Badge } from '@/components/ui/badge';
import { getCuttingMaintenance, maintenanceLabels } from '@/lib/cutting-maintenance';

export function CuttingMaintenanceBadge({ tool }: { tool: { name: string; kind?: string | null; params?: Record<string, unknown> | null } }) {
  const m = getCuttingMaintenance(tool);
  if (m.status === 'untracked') return null;
  return <Badge variant={m.status === 'out_of_service' ? 'destructive' : m.status === 'ready' ? 'secondary' : 'outline'} className="mt-1 max-w-full whitespace-normal text-[11px]" title={`${m.part}${m.suggested ? ' — suggested inspection, condition unknown' : ''}`}>{maintenanceLabels[m.status]}{m.suggested ? ' · suggested' : ''}</Badge>;
}