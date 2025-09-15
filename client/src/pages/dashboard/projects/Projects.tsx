import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Badge } from '@/components/ui/data-display/badge';
import { useProjects } from '@/hooks/useProjects';

export default function DashboardProjects() {
  const { projects = [], isLoading } = useProjects();
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('all');

  // collect unique tag names
  const tags = useMemo(
    () => [
      'all',
      ...Array.from(new Set(projects.flatMap((p) => (p.tags || []).map((t) => t.name)))),
    ],
    [projects]
  );

  // filter projects by search + tag
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const inText =
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.name.toLowerCase().includes(q));

      const inTag = tag === 'all' || (p.tags || []).some((t) => t.name === tag);
      return inText && inTag;
    });
  }, [projects, search, tag]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link to="/dashboard/projects/new">New Project</Link>
        </Button>
      </div>

      {/* Search + Tags */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:flex-1"
        />
        <div className="flex gap-2 overflow-x-auto">
          {tags.map((t) => (
            <Badge
              key={t}
              variant={t === tag ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setTag(t)}
            >
              {t === 'all' ? 'All' : `#${t}`}
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="border rounded-lg overflow-hidden">
              {p.cover_image && (
                <img src={p.cover_image} alt={p.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                {p.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {(p.tags || []).slice(0, 4).map((t) => (
                    <Badge key={t.id} variant="secondary">
                      #{t.name}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  {p.live_url && (
                    <a
                      className="text-sm underline"
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live
                    </a>
                  )}
                  {p.repo_url && (
                    <a
                      className="text-sm underline text-muted-foreground"
                      href={p.repo_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
