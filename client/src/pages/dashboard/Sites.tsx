import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/navigation/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/navigation/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/feedback/alert-dialog";
import {
  Plus,
  Globe,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/* ------- Types ------- */
export type Site = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  template?: string;
  status: string;
  published: boolean;
  created_at: string;
};

/* ------- API Helpers ------- */
export async function listSites(userId: string): Promise<Site[]> {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Site[];
}

export async function deleteSite(siteId: string) {
  const { error } = await supabase.from("sites").delete().eq("id", siteId);
  if (error) throw error;
}

/* ------- Component ------- */
function Sites() {
  const { user } = useUser();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await listSites(user.id);
        setSites(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load sites");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSite(id);
      setSites(sites.filter((s) => s.id !== id));
      toast.success("Site deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete site");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Sites</h1>
        <Link to="/dashboard/sites/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Site
          </Button>
        </Link>
      </div>

      {/* Sites List */}
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No sites yet.{" "}
            <Link to="/dashboard/sites/new" className="underline">
              Create your first site
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/editor/${s.id}`}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`/site/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> View Live
                        </a>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete site "{s.name}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the site and its pages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDelete(s.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
                <CardDescription>/{s.slug}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {s.published ? "Published" : "Draft"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/editor/${s.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <a
                    href={`/site/${s.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="gap-1">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sites;
