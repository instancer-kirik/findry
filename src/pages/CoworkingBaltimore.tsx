import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, MapPin, Users, Wifi, Coffee, Globe } from "lucide-react";

interface MemberSite {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string;
}

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const CoworkingBaltimore = () => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["baltimore-member-sites"],
    queryFn: async (): Promise<MemberSite[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url, contact_methods")
        .eq("is_public", true);

      if (error) throw error;

      return (data || [])
        .map((p: any) => ({
          id: p.id,
          username: p.username,
          full_name: p.full_name,
          bio: p.bio,
          avatar_url: p.avatar_url,
          website: (p.contact_methods?.website as string) || "",
        }))
        .filter((p: MemberSite) => p.website.trim().length > 0);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Baltimore, MD
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Baltimore Coworking Space
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A community event space and coworking home for makers, artists, and
            small businesses. Come build something with us.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Join the space</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#member-sites">See member websites</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-14 sm:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Community first",
              text: "Members get a Garflock account with a public profile and a link out to their own site.",
            },
            {
              icon: Wifi,
              title: "Room to work",
              text: "Open work areas, an event space in construction, and room for panels, meetups, and workshops.",
            },
            {
              icon: Coffee,
              title: "Show up as you are",
              text: "Zero-to-one makers, DIY fabricators, and small business owners building in public.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Member websites */}
      <section id="member-sites" className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-2xl font-bold">Member websites</h2>
        <p className="mt-1 text-muted-foreground">
          People in the space and what they're building. Click through to their
          site, or view their Garflock profile.
        </p>

        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Loading members…</p>
        ) : members.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Globe className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                No member sites yet. Members can add theirs from their profile
                setup — it shows up here automatically.
              </p>
              <Button asChild variant="outline">
                <Link to="/signup">Create your account</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Card key={m.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={m.avatar_url || undefined} />
                      <AvatarFallback>
                        {(m.full_name || m.username || "?").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {m.full_name || m.username || "Member"}
                      </p>
                      {m.username && (
                        <p className="truncate text-sm text-muted-foreground">
                          @{m.username}
                        </p>
                      )}
                    </div>
                  </div>
                  {m.bio && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {m.bio}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <a
                        href={normalizeUrl(m.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Visit site
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/profile/${m.id}`}>Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold">Work from here</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Join the space, get your profile, and put your website on this
            page.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CoworkingBaltimore;
