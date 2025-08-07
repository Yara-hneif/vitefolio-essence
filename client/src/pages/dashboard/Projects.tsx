import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/projects/ProjectCard';
import { getUserProjects } from '@/data/mockData';
import { Plus, Search, Filter } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!user) return null;

  const { owned, collaborative } = getUserProjects(user.id);
  const allProjects = [...owned, ...collaborative];

  const filteredProjects = (projects: typeof owned) => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects and collaborations
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/projects/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {['all', 'planning', 'in-progress', 'completed'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Projects ({allProjects.length})</TabsTrigger>
          <TabsTrigger value="owned">Owned ({owned.length})</TabsTrigger>
          <TabsTrigger value="collaborative">Collaborations ({collaborative.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredProjects(allProjects).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button asChild>
                <Link to="/dashboard/projects/new">Create your first project</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects(allProjects).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  showActions={project.userId === user.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="owned" className="space-y-6">
          {filteredProjects(owned).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't created any projects yet</p>
              <Button asChild>
                <Link to="/dashboard/projects/new">Create your first project</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects(owned).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborative" className="space-y-6">
          {filteredProjects(collaborative).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You're not collaborating on any projects yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects(collaborative).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  showActions={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;