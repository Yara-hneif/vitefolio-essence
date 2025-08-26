import { useEffect, useMemo, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/Project";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import ProjectForm from "@/features/admin/components/projects/ProjectForm";
import ImportFromGitHub from "@/features/admin/components/projects/ImportFromGitHub";

import {
  getSyncConfig,
  runSyncNow,
  updateSyncConfig,
  type SyncConfig,
} from "@/lib/syncApi";

export default function AdminProjectsPage() {
  const {
    projects,
    isLoading,
    isError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  // Create/Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  // GitHub import modal state
  const [importOpen, setImportOpen] = useState(false);

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
    void fetchConfig();
    // no deps: load once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveConfig = async (patch: Partial<SyncConfig>) => {
    try {
      setCfgSaving(true);
      const next = await updateSyncConfig({ ...(cfg ?? {}), ...patch });
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
      // TODO: optionally invalidate projects query
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
    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted successfully");
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

  const draftQueue = useMemo(
    () => (Array.isArray(projects) ? projects.filter((p) => p.status === "draft") : []),
    [projects]
  );

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
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      {/* Header + actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage, import, and review your projects. GitHub sync adds new repos as drafts for admin approval.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setImportOpen(true)} variant="outline">
            Import from GitHub
          </Button>
          <Button onClick={openCreate}>+ Add New Project</Button>
        </div>
      </div>

      {/* Server-backed sync controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>GitHub Sync (Server)</CardTitle>
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
            <Label htmlFor="gh-interval">Interval (minutes)</Label>
            <Input
              id="gh-interval"
              type="number"
              min={1}
              value={cfg?.intervalMin ?? 30}
              onChange={(e) =>
                setCfg((c) => (c ? { ...c, intervalMin: Math.max(1, Number(e.target.value || 1)) } : c))
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
              <Button variant="secondary" onClick={() => void fetchConfig()} disabled={cfgLoading}>
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
                  {" "}·{" "}
                  <Badge variant="secondary" className="align-middle">
                    created {cfg.lastResult?.created ?? "-"} / failed {cfg.lastResult?.failed ?? "-"}
                  </Badge>
                </>
              ) : null}
            </div>
            {!import.meta.env.VITE_SYNC_SECRET && (
              <span className="text-xs text-destructive">
                Warning: VITE_SYNC_SECRET is not set (dev only). Prefer JWT in production.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Draft review queue */}
      {draftQueue.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Review Queue (Drafts)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {draftQueue.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded-md p-3"
              >
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.repo_url ? (
                      <>
                        Source:{" "}
                        <a className="underline" href={p.repo_url} target="_blank" rel="noreferrer">
                          {p.repo_url}
                        </a>
                      </>
                    ) : (
                      "No repository URL"
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
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

      {/* All projects list */}
      {isLoading ? (
        <p>Loading projects...</p>
      ) : isError ? (
        <p className="text-destructive">Failed to load projects</p>
      ) : (
        <div className="grid gap-6">
          {Array.isArray(projects) &&
            projects.map((project: Project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      {project.title}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        ({project.status})
                      </span>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(project)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.tags ?? []).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Project create/edit modal */}
      <ProjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={currentProject}
        mode={formMode}
        submitting={submitting}
        onSubmit={handleSubmitForm}
      />

      {/* GitHub import modal */}
      <ImportFromGitHub open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
