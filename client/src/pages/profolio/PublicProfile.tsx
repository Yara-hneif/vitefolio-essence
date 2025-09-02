import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/navigation/button";
import { Badge } from "@/components/ui/data-display/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import UserAvatar from "@/components/common/UserAvatar";
import { Github, Linkedin, Twitter, Globe, ArrowLeft, Mail, Loader2 } from "lucide-react";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

type Profile = {
  id: string;
  username: string;
  name?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  socialLinks?: SocialLinks;
};

type Project = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  slug: string;
  cover_image?: string;
  live_url?: string;
  repo_url?: string;
  tags?: string[];
  created_at?: string;
};

export default function PublicProfile() {
  const { handle, username: usernameFromProfileRoute } = useParams();
  const username = handle || usernameFromProfileRoute;

  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const isOwner = useMemo(
    () => !!(currentUser?.username && username && currentUser.username === username),
    [currentUser?.username, username]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!username) {
        setProfile(null);
        setProjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const optimisticProfile: Partial<Profile> | null =
        isOwner && currentUser
          ? {
            id: currentUser.id,
            username: currentUser.username!,
            name: currentUser.name,
            email: currentUser.email,
            bio: (currentUser as any)?.bio,
            skills: ((currentUser as any)?.skills as string[]) || [],
            avatar_url: (currentUser as any)?.avatarUrl,
            socialLinks: (currentUser as any)?.socialLinks as SocialLinks,
          }
          : null;

      if (mounted && optimisticProfile) setProfile((prev) => ({ ...(prev || {} as Profile), ...optimisticProfile } as Profile));

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (profErr || !prof) {
        if (mounted) {
          setProfile(null);
          setProjects([]);
          setLoading(false);
        }
        return;
      }

      const mergedProfile: Profile = {
        id: prof.id,
        username: prof.username,
        name: prof.name ?? optimisticProfile?.name,
        email: prof.email ?? optimisticProfile?.email,
        bio: prof.bio ?? optimisticProfile?.bio,
        skills: prof.skills ?? optimisticProfile?.skills ?? [],
        avatar_url: prof.avatar_url ?? optimisticProfile?.avatar_url,
        socialLinks: prof.socialLinks ?? optimisticProfile?.socialLinks,
      };

      const { data: projs, error: pjErr } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", prof.id)
        .order("created_at", { ascending: false });

      if (mounted) {
        setProfile(mergedProfile);
        setProjects(pjErr || !projs ? [] : projs);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [username, isOwner, currentUser]);

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
            We couldn’t find a profile for <span className="font-medium">@{username}</span>.
          </p>

          <div className="flex gap-3 justify-center">
            {/* Go Home*/}
            <Button asChild>
              <Link to="/" replace>
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Profile header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <UserAvatar
                user={{
                  name: profile.name || profile.username || "User",
                  username: profile.username,
                  avatar: profile.avatar_url,
                }}
                size="lg"
                className="h-24 w-24"
              />

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name || profile.username}</h1>
                  {profile.username && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                </div>

                {profile.bio && <p className="text-lg text-muted-foreground">{profile.bio}</p>}

                {/* Social Links */}
                {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {profile.socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {profile.email && (
                  <div>
                    <Button className="mt-2" asChild>
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        {Array.isArray(profile.skills) && profile.skills.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
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
                  {p.cover_image && (
                    <img
                      src={p.cover_image}
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
                      {(p.tags || []).slice(0, 4).map((t: string) => (
                        <Badge key={t} variant="secondary">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-3 text-sm">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
