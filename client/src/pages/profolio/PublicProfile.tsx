import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

import AppSidebar from "@/components/layout/partials/sidebar/AppSidebar";

import { Button } from "@/components/ui/navigation/button";
import { Badge } from "@/components/ui/data-display/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import UserAvatar from "@/components/common/UserAvatar";
import MessageDialog from "@/components/dialogs/MessageDialog";

import { Github, Linkedin, Twitter, Globe, ArrowLeft, Loader2, Mail } from "lucide-react";

import type { User } from "@/types/models/User";
import type { Project } from "@/types/models/Project";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export default function PublicProfile() {
  const { username: usernameParam } = useParams();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [openMessage, setOpenMessage] = useState(false);

  const isOwner = useMemo(
    () => !!(currentUser?.username && usernameParam && currentUser.username === usernameParam),
    [currentUser?.username, usernameParam]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!usernameParam) {
        setProfile(null);
        setProjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", usernameParam)
        .maybeSingle();

      if (profErr || !prof) {
        if (mounted) {
          setProfile(null);
          setProjects([]);
          setLoading(false);
        }
        return;
      }

      const { data: projs, error: pjErr } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", prof.id)
        .order("created_at", { ascending: false });

      if (mounted) {
        setProfile(prof as User);
        setProjects(pjErr || !projs ? [] : (projs as Project[]));
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [usernameParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">
            We couldn’t find a profile for <span className="font-medium">@{usernameParam}</span>.
          </p>

          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to="/" replace>
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = (profile.social_links as SocialLinks) || {};

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 container px-4 py-8 max-w-6xl mx-auto">
          
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <UserAvatar
                  user={{
                    name: profile.name || profile.username || "User",
                    username: profile.username,
                    avatar: profile.avatar ?? undefined,
                  }}
                  size="lg"
                  className="h-24 w-24"
                />

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name || profile.username}</h1>
                    {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
                  </div>

                  {profile.bio && <p className="text-lg text-muted-foreground">{profile.bio}</p>}

                  
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {socialLinks.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>

                  
                  {!isOwner && (
                    <Button className="mt-2" onClick={() => setOpenMessage(true)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  )}
                </div>
              </div>
            </div>

            
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </CardContent>
            </Card>
          </div>

          
          {Array.isArray(profile.skills) && profile.skills.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <div className="text-sm text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </div>
            </div>

            {projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No projects to display</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <Card key={p.id} className="overflow-hidden hover-lift">
                    {(p as any).cover_image && (
                      <img
                        src={(p as any).cover_image}
                        alt={p.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {p.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(p.tags || []).slice(0, 4).map((t) => (
                          <Badge key={t.id} variant="secondary">
                            #{t.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-3 text-sm">
                        {(p as any).live_url && (
                          <a className="underline" href={(p as any).live_url} target="_blank" rel="noreferrer">
                            Live
                          </a>
                        )}
                        {(p as any).repo_url && (
                          <a className="underline text-muted-foreground" href={(p as any).repo_url} target="_blank" rel="noreferrer">
                            Repo
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {openMessage && (
        <MessageDialog
          receiverId={profile.id}
          onClose={() => setOpenMessage(false)}
        />
      )}
    </div>
  );
}
