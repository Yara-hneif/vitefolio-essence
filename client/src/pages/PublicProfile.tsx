import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/common/UserAvatar";
import { Github, Linkedin, Twitter, Globe, ArrowLeft, Mail } from "lucide-react";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

type PublicProfileShape = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  avatarUrl?: string;
};

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const { user, loading } = useAuth();
  const { projects = [], isLoading: loadingProjects } = useProjects();

  // استنتج بروفايل بسيط من المستخدم الحالي فقط (بدون mockUsers)
  const profile: PublicProfileShape | null =
    user && user.username && username && user.username === username
      ? {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: (user as any)?.bio,
        skills: ((user as any)?.skills as string[]) || [],
        socialLinks: (user as any)?.socialLinks as SocialLinks,
        avatarUrl: (user as any)?.avatarUrl,
      }
      : null;

  if (loading || loadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
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
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // مؤقتًا: نعرض كل المشاريع (لا يوجد ownerId في Project حالياً)
  // إذا أضفتِ ownerId لاحقاً، يمكنكِ فلترة المشاريع هنا.
  const allProjects = projects;

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
        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <UserAvatar
                user={{
                  name: profile.name || profile.username || "User",
                  username: profile.username,
                  avatar: profile.avatarUrl, // ← بدل src
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

                {profile.bio && (
                  <p className="text-lg text-muted-foreground">{profile.bio}</p>
                )}

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
                <p className="text-2xl font-bold">{allProjects.length}</p>
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
              {allProjects.length} project{allProjects.length !== 1 ? "s" : ""}
            </div>
          </div>

          {allProjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No projects to display</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  {(p.coverImage || (p as any).imageUrl) && (
                    <img
                      src={p.coverImage || (p as any).imageUrl}
                      alt={p.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{p.title}</h3>
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
                      {p.url && (
                        <a className="underline" href={p.url} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      )}
                      {(p as any).liveUrl && !p.url && (
                        <a className="underline" href={(p as any).liveUrl} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      )}
                      {p.repoUrl && (
                        <a
                          className="underline text-muted-foreground"
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
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
