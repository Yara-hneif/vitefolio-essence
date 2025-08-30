import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/Project";
import { toast } from "sonner";
import { X, Github, Plus, RefreshCw, Settings2, Upload, Edit3, Trash2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProjectForm from "@/features/admin/components/projects/ProjectForm";
import ImportFromGitHub from "@/features/admin/components/projects/ImportFromGitHub";

import {
  getSyncConfig,
  runSyncNow,
  updateSyncConfig,
  type SyncConfig,
} from "@/lib/syncApi";

const AdminProjectsPanel = () => {
  const { projectsOpen, closeProjects, isAdmin } = useAdmin();
  const {
    projects,
    isLoading,
    isError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const hidden = !isAdmin;

  // Create/Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  // GitHub import modal state
  const [importOpen, setImportOpen] = useState(false);

  // search/filter
  const [q, setQ] = useState("");

  // Server sync config
  const [cfg, setCfg] = useState<SyncConfig | null>(null);
  const [cfgLoading, setCfgLoading] = useState(false);
  const [cfgSaving, setCfgSaving] = useState(false);
  const [syncingNow, setSyncingNow] = useState(false);

  const fetchConfig = async () => {
    try {
      setCfgLoading(true);
      const c = await getSyncConfig();
      setCfg(c);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load sync config");
    } finally {
      setCfgLoading(false);
    }
  };

  useEffect(() => {
    if (projectsOpen) void fetchConfig();
  }, [projectsOpen]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && projectsOpen) closeProjects();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projectsOpen, closeProjects]);

  const saveConfig = async (patch: Partial<SyncConfig>) => {
    try {
      setCfgSaving(true);
      const next = await updateSyncConfig({ ...cfg, ...patch });
      setCfg(next);
      toast.success("Sync config saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save config");
    } finally {
      setCfgSaving(false);
    }
  };

  const triggerSync = async () => {
    try {
      setSyncingNow(true);
      const res = await runSyncNow();
      toast.success(`Sync completed: created ${res.created}, failed ${res.failed}`);
      // optional: invalidate queries here if your useProjects supports it
    } catch (e: any) {
      toast.error(e?.message ?? "Sync failed");
    } finally {
      setSyncingNow(false);
      void fetchConfig();
    }
  };

  const openCreate = () => {
    setCurrentProject(undefined);
    setFormMode("create");
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setCurrentProject(project);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleSubmitForm = async (payload: Partial<Project>) => {
    try {
      setSubmitting(true);
      if (formMode === "edit" && currentProject?.id) {
        await updateProject.mutateAsync({ id: currentProject.id, updates: payload });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync(payload);
        toast.success("Project created");
      }
      setFormOpen(false);
      setCurrentProject(undefined);
    } catch {
      toast.error("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Drafts & filtered list
  const draftQueue = useMemo(
    () => (Array.isArray(projects) ? projects.filter((p) => p.status === "draft") : []),
    [projects]
  );

  const listFiltered = useMemo(() => {
    const src = Array.isArray(projects) ? projects : [];
    const query = q.trim().toLowerCase();
    if (!query) return src;
    return src.filter((p) =>
      [p.title, p.description, p.category, p.slug, ...(p.tags || [])]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query))
    );
  }, [projects, q]);

  const publishQuick = async (p: Project) => {
    try {
      await updateProject.mutateAsync({ id: p.id, updates: { status: "published" } });
      toast.success(`Published "${p.title}"`);
    } catch {
      toast.error("Publish failed");
    }
  };

  const lastRunLabel = cfg?.lastRunAt ? new Date(cfg.lastRunAt).toLocaleString() : "Never";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm transition-opacity ${
          projectsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeProjects}
        aria-hidden
      />

      {/* Slide-over */}
      <aside
        className={`fixed right-0 top-0 z-[75] h-full w-full sm:w-[560px] lg:w-[720px] 
        bg-white/90 dark:bg-zinc-900/90 border-l shadow-2xl backdrop-blur-md
        transition-transform ${projectsOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Projects panel"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 backdrop-blur p-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight">Projects</h2>
            <p className="text-xs text-muted-foreground">
              Manage, import, and review projects. GitHub sync adds new repos as drafts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void fetchConfig()} disabled={cfgLoading}>
              {cfgLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="default" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
            <button
              className="p-2 rounded-full hover:bg-black/5"
              onClick={closeProjects}
              aria-label="Close projects panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-6">
            {/* Sync section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    GitHub Sync (Server)
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Enabled</span>
                    <Switch
                      checked={!!cfg?.enabled}
                      onCheckedChange={(v) => saveConfig({ enabled: Boolean(v) })}
                      disabled={cfgLoading || cfgSaving}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="gh-username">GitHub Username</Label>
                  <Input
                    id="gh-username"
                    placeholder="e.g. octocat"
                    value={cfg?.username ?? ""}
                    onChange={(e) => setCfg((c) => (c ? { ...c, username: e.target.value } : c))}
                    onBlur={() => saveConfig({ username: cfg?.username ?? "" })}
                    disabled={cfgLoading || cfgSaving}
                  />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="gh-interval">Interval</Label>
                  <Input
                    id="gh-interval"
                    type="number"
                    min={1}
                    value={cfg?.intervalMin ?? 30}
                    onChange={(e) =>
                      setCfg((c) =>
                        c ? { ...c, intervalMin: Math.max(1, Number(e.target.value || 1)) } : c
                      )
                    }
                    onBlur={() => saveConfig({ intervalMin: cfg?.intervalMin ?? 30 })}
                    disabled={cfgLoading || cfgSaving}
                  />
                </div>
                <div className="md:col-span-1 flex items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!cfg?.includeTopics}
                      onCheckedChange={(v) => saveConfig({ includeTopics: Boolean(v) })}
                      disabled={cfgLoading || cfgSaving}
                    />
                    <span className="text-sm">Include Topics</span>
                  </div>
                </div>
                <div className="md:col-span-1 flex items-end justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => void fetchConfig()}
                    disabled={cfgLoading}
                  >
                    {cfgLoading ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button onClick={() => void triggerSync()} disabled={syncingNow}>
                    {syncingNow ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>

                <div className="md:col-span-5 flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Last run: <span className="font-medium">{lastRunLabel}</span>
                    {cfg?.lastResult ? (
                      <>
                        {" "}
                        ·{" "}
                        <Badge variant="secondary" className="align-middle">
                          created {cfg.lastResult?.created ?? "-"} / failed {cfg.lastResult?.failed ?? "-"}
                        </Badge>
                      </>
                    ) : null}
                  </div>
                  {!import.meta.env.VITE_SYNC_SECRET && (
                    <span className="text-xs text-destructive">
                      Warning: VITE_SYNC_SECRET is not set (dev only).
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Import from GitHub */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />
                Import public repositories as draft projects.
              </div>
              <Button variant="outline" onClick={() => setImportOpen(true)}>
                <Upload className="h-4 w-4 mr-1" />
                Import from GitHub
              </Button>
            </div>

            <Separator />

            {/* Search */}
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search projects by title, tag, or description…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button variant="secondary" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </Button>
            </div>

            {/* Drafts queue */}
            {draftQueue.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Review Queue (Drafts)
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {draftQueue.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded-md p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {p.repoUrl ? (
                            <>
                              Source:{" "}
                              <a className="underline" href={p.repoUrl} target="_blank" rel="noreferrer">
                                {p.repoUrl}
                              </a>
                            </>
                          ) : (
                            "No repository URL"
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" onClick={() => publishQuick(p)}>
                          Publish
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All projects */}
            <div className="grid gap-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading projects…</p>
              ) : isError ? (
                <p className="text-sm text-destructive">Failed to load projects</p>
              ) : listFiltered.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    No projects match your search.
                  </CardContent>
                </Card>
              ) : (
                listFiltered.map((project) => (
                  <Card key={project.id} className="hover:bg-muted/30 transition">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="truncate">
                          {project.title}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            ({project.status})
                          </span>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(project)}>
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(project.tags ?? []).map((tag, idx) => (
                          <span
                            key={`${tag}-${idx}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Modals */}
      <ProjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={currentProject}
        mode={formMode}
        submitting={submitting}
        onSubmit={handleSubmitForm}
      />

      <ImportFromGitHub open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
};

export default AdminProjectsPanel;
