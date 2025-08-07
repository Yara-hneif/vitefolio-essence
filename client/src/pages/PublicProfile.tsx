import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/common/UserAvatar';
import ProjectCard from '@/components/projects/ProjectCard';
import { mockUsers } from '@/contexts/AuthContext';
import { getProjectsByUserId, getCollaborativeProjects } from '@/data/mockData';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  MapPin, 
  Calendar,
  ArrowLeft,
  Mail
} from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  
  const user = mockUsers.find(u => u.username === username);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const ownedProjects = getProjectsByUserId(user.id);
  const collaborativeProjects = getCollaborativeProjects(user.id);
  const allProjects = [...ownedProjects, ...collaborativeProjects];

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
              <UserAvatar user={user} size="lg" className="h-24 w-24" />
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                {user.bio && (
                  <p className="text-lg text-muted-foreground">{user.bio}</p>
                )}

                {/* Social Links */}
                {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {user.socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {user.socialLinks.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {user.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {user.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{allProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-semibold">{ownedProjects.length}</p>
                    <p className="text-xs text-muted-foreground">Created</p>
                  </div>
                  <div>
                    <p className="font-semibold">{collaborativeProjects.length}</p>
                    <p className="text-xs text-muted-foreground">Collaborated</p>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <a href={`mailto:${user.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
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
              {allProjects.length} project{allProjects.length !== 1 ? 's' : ''}
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
              {allProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;