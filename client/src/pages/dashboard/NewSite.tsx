import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TemplateSelector from '@/features/templates/TemplateSelector';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSiteFromTemplate } from '@/lib/templates';

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

interface SiteFormData {
  name: string;
  slug: string;
  description: string;
}

const NewSite = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = useState<'form' | 'template'>('form');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    slug: '',
    description: ''
  });

  const username = user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "user";

  const handleInputChange = (field: keyof SiteFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Site name is required');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('Site slug is required');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    return true;
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(false);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleCreateSite = async () => {
    if (!validateForm()) return;
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    setLoading(true);
    
    try {
      const siteId = await createSiteFromTemplate(selectedTemplate, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        userId: user?.id || ''
      });
      
      toast.success('Site created successfully!');
      navigate('/dashboard/sites');
    } catch (error) {
      toast.error('Failed to create site. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/sites')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sites
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Site</h1>
          <p className="text-muted-foreground">
            Set up your new portfolio website
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${step === 'form' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
            step === 'form' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
          }`}>
            1
          </div>
          <span className="text-sm font-medium">Site Details</span>
        </div>
        <div className="flex-1 h-px bg-border"></div>
        <div className={`flex items-center gap-2 ${selectedTemplate ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
            selectedTemplate ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Choose Template</span>
        </div>
      </div>

      {/* Site Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Information
          </CardTitle>
          <CardDescription>
            Enter the basic information for your new site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name *</Label>
            <Input
              id="site-name"
              placeholder="My Awesome Portfolio"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-slug">Site URL *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {window.location.origin}/u/{username}/
              </span>
              <Input
                id="site-slug"
                placeholder="my-portfolio"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Description</Label>
            <Textarea
              id="site-description"
              placeholder="A brief description of your portfolio..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Template Selection</CardTitle>
          <CardDescription>
            Choose a template to start with. You can customize it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTemplate ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowTemplateDialog(true)}
              >
                Change Template
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No template selected</p>
              <Button onClick={() => setShowTemplateDialog(true)}>
                Choose Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Button */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/sites')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateSite}
          disabled={!formData.name || !formData.slug || !selectedTemplate || loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Site...
            </>
          ) : (
            'Create Site'
          )}
        </Button>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a template to start building your site
            </DialogDescription>
          </DialogHeader>
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setShowTemplateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewSite;