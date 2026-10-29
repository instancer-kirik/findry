/** Exact visible identity only: do not combine quantities or infer matching objects. */
export function catalogIdentity(item: { name: string; brand?: string | null; model?: string | null; shape?: string | null; power?: string | null; quantity?: string | null }) {
  return [item.name, item.brand, item.model, item.shape, item.power, item.quantity]
    .map(value => (value ?? "").trim().toLowerCase()).join("\u001f");
}

export function freshCatalogItems<T extends Parameters<typeof catalogIdentity>[0]>(items: T[], seen: Set<string>) {
  return items.filter(item => {
    const identity = catalogIdentity(item);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}