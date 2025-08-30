import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/common/UserAvatar';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FolderOpen,
      current: location.pathname.startsWith('/dashboard/projects')
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: Settings,
      current: location.pathname === '/dashboard/profile'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Portfolio</span>
            </Link>
          </div>

{/* User Info */}
<div className="p-6 border-b">
  <div className="flex items-center gap-3">
    <UserAvatar
      user={{
        name: user?.name || user?.username || user?.email || "User",
        username: user?.username,
        avatar: user?.avatarUrl ,
      }}
      size="lg"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">
        {user?.name || user?.username || user?.email || "User"}
      </p>
      {user?.username && (
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
      )}
    </div>
  </div>
</div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/dashboard/projects/new"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted mt-4"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;