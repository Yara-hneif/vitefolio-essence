import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/data-display/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    name: string;
    avatar?: string;
    username?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;