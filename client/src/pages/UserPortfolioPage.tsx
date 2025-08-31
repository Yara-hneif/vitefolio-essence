import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Project = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image?: string;
  live_url?: string;
  repo_url?: string;
};

export default function UserPortfolioPage() {
  // دعم /@:handle أو /profile/:username
  const { handle, username } = useParams();
  const slug = handle || username;

  const { user } = useAuth();
  const isOwner = !!(user?.username && slug && user.username === slug);

  const [projects, setProjects] = useState<Project[]>([]);
  const [displayName, setDisplayName] = useState<string>(slug ? slug[0].toUpperCase() + slug.slice(1) : "User");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1) جلب بروفايل المستخدم
      const { data: prof } = await supabase.from("profiles").select("*").eq("username", slug).maybeSingle();
      if (prof) {
        if (mounted) {
          setDisplayName(prof.name || slug);
          setAvatar(prof.avatar_url || undefined);
        }

        // 2) جلب المشاريع لهذا المستخدم
        const { data: projs } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", prof.id)
          .order("created_at", { ascending: false });

        if (mounted) setProjects(projs || []);
      } else {
        if (mounted) {
          setProjects([]);
        }
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-4xl mx-auto p-6 flex items-center gap-4">
          {avatar && (
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">@{slug}</p>
          </div>
          {isOwner && (
            <span className="ml-auto text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-900">
              You are the owner
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-muted-foreground">
            This is your personal portfolio page. In future releases, you will customize sections, colors, and layout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground">No projects to display</p>
          ) : (
            <ul className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <li key={p.id} className="border rounded-xl p-4">
                  {p.cover_image && (
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="w-full h-36 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  )}
                  <div className="mt-2 flex gap-3 text-sm">
                    {p.live_url && (
                      <a className="underline" href={p.live_url} target="_blank" rel="noreferrer">
                        Live
                      </a>
                    )}
                    {p.repo_url && (
                      <a className="underline text-muted-foreground" href={p.repo_url} target="_blank" rel="noreferrer">
                        Repo
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
