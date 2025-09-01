import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  User, 
  Briefcase, 
  Mail, 
  Image, 
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  features: string[];
  blocks: any[];
  isPopular?: boolean;
  demoUrl?: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: 'portfolio-professional',
    name: 'Professional Portfolio',
    description: 'A clean, modern portfolio template perfect for developers and designers',
    thumbnail: '/api/placeholder/400/300',
    category: 'Portfolio',
    isPopular: true,
    demoUrl: '/demo',
    features: ['Hero Section', 'Projects Grid', 'About Section', 'Contact Form', 'Skills Display'],
    blocks: [
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'navbar-block',
        component: {
          name: 'Navbar',
          options: {
            logoText: 'Your Name',
            items: [
              { label: 'Home', href: '#home' },
              { label: 'About', href: '#about' },
              { label: 'Projects', href: '#projects' },
              { label: 'Contact', href: '#contact' }
            ]
          }
        }
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'hero-block',
        component: {
          name: 'Hero',
          options: {
            title: 'Welcome to My Portfolio',
            subtitle: 'I create beautiful digital experiences with modern technologies',
            ctaLabel: 'View My Work',
            ctaHref: '#projects'
          }
        }
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'about-block',
        component: {
          name: 'AboutSection',
          options: {
            html: '<h2>About Me</h2><p>I am a passionate developer with expertise in modern web technologies...</p>'
          }
        }
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'projects-block',
        component: {
          name: 'ProjectsGrid',
          options: {
            items: [
              {
                title: 'Project 1',
                subtitle: 'Web Application',
                href: '#',
                imageUrl: '/api/placeholder/400/300'
              },
              {
                title: 'Project 2',
                subtitle: 'Mobile App',
                href: '#',
                imageUrl: '/api/placeholder/400/300'
              }
            ]
          }
        }
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'contact-block',
        component: {
          name: 'ContactSection',
          options: {
            mailto: 'hello@example.com'
          }
        }
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'footer-block',
        component: {
          name: 'Footer',
          options: {
            copyright: '© 2024 Your Name. All rights reserved.'
          }
        }
      }
    ]
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'A bold, artistic template for creative professionals and artists',
    thumbnail: '/api/placeholder/400/300',
    category: 'Portfolio',
    features: ['Artistic Layout', 'Gallery Grid', 'Creative Animations', 'Bold Typography'],
    blocks: [
      // Similar structure but with different styling options
    ]
  },
  {
    id: 'business-landing',
    name: 'Business Landing',
    description: 'Professional landing page template for businesses and startups',
    thumbnail: '/api/placeholder/400/300',
    category: 'Business',
    features: ['Landing Hero', 'Features Section', 'Testimonials', 'CTA Buttons'],
    blocks: [
      // Business-focused blocks
    ]
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  
  const categories = ['All', 'Portfolio', 'Business', 'Personal'];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Start with a professional template and customize it to match your style
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover-lift cursor-pointer relative">
            {template.isPopular && (
              <Badge className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.features.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                {template.demoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;