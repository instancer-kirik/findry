import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import data from "@/data/baltimore-hackerspace-tools.json";

type Item = { name: string; details?: string[]; owner?: string };
type Category = { name: string; items: Item[] };

const HackerspaceTools = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const cats = (data as { categories: Category[] }).categories;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return cats
      .filter(c => !cat || c.name === cat)
      .map(c => ({
        ...c,
        items: c.items.filter(i =>
          !s || i.name.toLowerCase().includes(s) || (i.details ?? []).some(d => d.toLowerCase().includes(s))),
      }))
      .filter(c => c.items.length);
  }, [q, cat, cats]);

  const total = cats.reduce((n, c) => n + c.items.length, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <p className="text-sm text-muted-foreground">Baltimore, MD</p>
        <h1 className="text-3xl font-bold mt-1">{data.place}: tools</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          {total} tools. Each one belongs to a member, not the space. Some need a short one-on-one training before use.
        </p>
        <div className="mt-3 flex gap-3 text-sm">
          <a href={data.source} target="_blank" rel="noreferrer" className="text-primary underline">Original list</a>
          <Link to="/floorplans" className="text-primary underline">Place big tools on a floorplan</Link>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Input placeholder="Search tools, e.g. laser, aluminum, 240V" value={q} onChange={e => setQ(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={cat ? "outline" : "default"} onClick={() => setCat(null)}>All</Button>
            {cats.map(c => (
              <Button key={c.name} size="sm" variant={cat === c.name ? "default" : "outline"} onClick={() => setCat(c.name)}>
                {c.name} <span className="ml-1 opacity-60">{c.items.length}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {filtered.map(c => (
            <section key={c.name}>
              <h2 className="text-xl font-semibold mb-3">{c.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {c.items.map(i => (
                  <Card key={i.name} className="p-4 flex flex-col">
                    <h3 className="font-medium">{i.name}</h3>
                    {i.details?.length ? (
                      <ul className="mt-2 text-sm text-muted-foreground list-disc pl-4 space-y-0.5">
                        {i.details.map(d => <li key={d}>{d}</li>)}
                      </ul>
                    ) : null}
                    <div className="mt-auto pt-3">
                      <Badge variant="outline" className="text-xs">
                        {i.owner ? `Owned by ${i.owner}` : "Member-owned · owner not listed yet"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
          {!filtered.length && <p className="text-muted-foreground">No tools match.</p>}
        </div>
      </div>
    </Layout>
  );
};

export default HackerspaceTools;
