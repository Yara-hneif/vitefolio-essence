import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Collaborator {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

interface CollaboratorTagProps {
  collaborator: Collaborator;
  variant?: 'default' | 'minimal';
  className?: string;
}

const CollaboratorTag: React.FC<CollaboratorTagProps> = ({ 
  collaborator, 
  variant = 'default',
  className 
}) => {
  if (variant === 'minimal') {
    return (
      <Link to={`/u/${collaborator.username}`}>
        <Badge 
          variant="secondary" 
          className={cn(
            "hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
            className
          )}
        >
          {collaborator.name}
        </Badge>
      </Link>
    );
  }

  return (
    <Link 
      to={`/u/${collaborator.username}`}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <UserAvatar user={collaborator} size="sm" />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">{collaborator.name}</span>
        <span className="text-xs text-muted-foreground truncate">@{collaborator.username}</span>
      </div>
    </Link>
  );
};

export default CollaboratorTag;