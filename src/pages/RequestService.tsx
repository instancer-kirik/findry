import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, X, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RequestService: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget_min: '',
    budget_max: '',
    delivery_days: '',
    skills_needed: [] as string[],
    attachments: [] as string[],
    requirements: '',
  });

  const serviceCategories = [
    { label: 'Audio Production', value: 'audio_production' },
    { label: 'Video Production', value: 'video_production' },
    { label: 'Graphic Design', value: 'graphic_design' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Photography', value: 'photography' },
    { label: 'Web Development', value: 'web_development' },
    { label: 'Event Planning', value: 'event_planning' },
    { label: 'Content Writing', value: 'content_writing' },
    { label: 'Consultation', value: 'consultation' },
    { label: 'Other', value: 'other' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills_needed.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills_needed: [...prev.skills_needed, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills_needed: prev.skills_needed.filter((s) => s !== skill),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `service-requests/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, publicUrl],
      }));

      toast({
        title: 'File uploaded',
        description: 'Attachment uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to request a service.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('service_requests').insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        delivery_days: formData.delivery_days ? parseInt(formData.delivery_days) : null,
        skills_needed: formData.skills_needed,
        attachments: formData.attachments,
        requirements: formData.requirements,
        status: 'open',
      });

      if (error) throw error;

      toast({
        title: 'Request submitted',
        description: 'Your service request has been posted successfully.',
      });

      navigate('/requests');
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Request a Service</CardTitle>
            <CardDescription>
              Describe what you need and connect with talented professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Service Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Need a professional music video editor"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service you need in detail..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Minimum Budget
                  </Label>
                  <Input
                    id="budget_min"
                    type="number"
                    placeholder="100"
                    value={formData.budget_min}
                    onChange={(e) => handleChange('budget_min', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Maximum Budget
                  </Label>
                  <Input
                    id="budget_max"
                    type="number"
                    placeholder="500"
                    value={formData.budget_max}
                    onChange={(e) => handleChange('budget_max', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-2">
                <Label htmlFor="delivery_days">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Delivery Timeline (days)
                </Label>
                <Input
                  id="delivery_days"
                  type="number"
                  placeholder="7"
                  value={formData.delivery_days}
                  onChange={(e) => handleChange('delivery_days', e.target.value)}
                  min="1"
                />
              </div>

              {/* Skills Needed */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills Needed</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Add a skill (e.g., Adobe Premiere)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button type="button" onClick={handleAddSkill} variant="secondary">
                    Add
                  </Button>
                </div>
                {formData.skills_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills_needed.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements, preferences, or guidelines..."
                  value={formData.requirements}
                  onChange={(e) => handleChange('requirements', e.target.value)}
                  rows={4}
                />
              </div>

              {/* File Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="attachments"
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('attachments')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload File
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Reference files, examples, or requirements
                  </span>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.attachments.map((url, index) => (
                      <div
                        key={url}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span className="text-sm truncate">Attachment {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachment(url)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestService;
