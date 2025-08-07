import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    name: 'John Doe',
    bio: 'Full-stack developer passionate about creating beautiful digital experiences.',
    avatar: '/api/placeholder/150/150',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    }
  },
  {
    id: '2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    name: 'Sarah Smith',
    bio: 'UI/UX Designer with a love for minimalist design and user-centered solutions.',
    avatar: '/api/placeholder/150/150',
    skills: ['Figma', 'React', 'CSS', 'Design Systems'],
    socialLinks: {
      github: 'https://github.com/sarahsmith',
      linkedin: 'https://linkedin.com/in/sarahsmith'
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username or email already exists
    const existingUser = mockUsers.find(
      u => u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      setLoading(false);
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      name: userData.name,
      bio: '',
      skills: [],
      socialLinks: {}
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { mockUsers };