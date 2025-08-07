import { mockUsers } from '@/contexts/AuthContext';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  status: 'planning' | 'in-progress' | 'completed';
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  collaborators: Collaborator[];
}

export interface Collaborator {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role?: string;
}

// Convert mockUsers to collaborators format
export const mockCollaborators: Collaborator[] = mockUsers.map(user => ({
  id: user.id,
  username: user.username,
  name: user.name,
  avatar: user.avatar
}));

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment processing, and admin dashboard. Implemented with modern technologies and best practices.',
    image: '/api/placeholder/600/400',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    status: 'completed',
    githubUrl: 'https://github.com/johndoe/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.example.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    userId: '1',
    collaborators: [mockCollaborators[1]]
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Modern portfolio built with Next.js and Tailwind CSS',
    longDescription: 'A responsive portfolio website showcasing projects and skills. Features dark mode, smooth animations, and optimized performance.',
    image: '/api/placeholder/600/400',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    status: 'in-progress',
    githubUrl: 'https://github.com/johndoe/portfolio',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    userId: '1',
    collaborators: []
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    longDescription: 'A collaborative task management application with real-time updates, team collaboration features, and project organization.',
    image: '/api/placeholder/600/400',
    technologies: ['React', 'Socket.io', 'MongoDB', 'Express', 'Redux'],
    status: 'planning',
    githubUrl: 'https://github.com/johndoe/task-manager',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    userId: '1',
    collaborators: [mockCollaborators[1]]
  },
  {
    id: '4',
    title: 'Design System',
    description: 'Comprehensive UI component library and design system',
    longDescription: 'A complete design system with reusable components, design tokens, and documentation. Built to scale across multiple applications.',
    image: '/api/placeholder/600/400',
    technologies: ['React', 'Storybook', 'Styled Components', 'TypeScript'],
    status: 'completed',
    githubUrl: 'https://github.com/sarahsmith/design-system',
    liveUrl: 'https://design-system.example.com',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-12',
    userId: '2',
    collaborators: [mockCollaborators[0]]
  }
];

// Get projects for a specific user
export const getProjectsByUserId = (userId: string): Project[] => {
  return mockProjects.filter(project => project.userId === userId);
};

// Get projects where user is a collaborator
export const getCollaborativeProjects = (userId: string): Project[] => {
  return mockProjects.filter(project => 
    project.collaborators.some(collaborator => collaborator.id === userId)
  );
};

// Get all projects (for browsing)
export const getAllProjects = (): Project[] => {
  return mockProjects;
};

// Get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

// Get user's complete project involvement (owned + collaborative)
export const getUserProjects = (userId: string): { owned: Project[], collaborative: Project[] } => {
  return {
    owned: getProjectsByUserId(userId),
    collaborative: getCollaborativeProjects(userId)
  };
};