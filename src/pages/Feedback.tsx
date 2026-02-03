import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Send, CheckCircle, Bug, Lightbulb, HelpCircle, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
];

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');
  
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    category: 'general',
    subject: '',
    message: '',
    projectId: projectIdFromUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          project_id: formData.projectId || null,
          category: formData.category,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: 'pending',
          metadata: {
            submitted_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href,
          },
        });

      if (error) throw error;
      
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error(`Failed to submit feedback: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 max-w-2xl">
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit Another
                </Button>
                <Button onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Send Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve by sharing your thoughts, reporting bugs, or suggesting features.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback Form
            </CardTitle>
            <CardDescription>
              {user ? 'We\'ll follow up with you if needed.' : 'Sign in to receive updates on your feedback.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project ID (optional) */}
              {projectIdFromUrl && (
                <div className="space-y-2">
                  <Label>Related Project</Label>
                  <Input 
                    value={formData.projectId} 
                    onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                    placeholder="Project ID (optional)"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Feedback will be linked to this project
                  </p>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief summary of your feedback"
                  required
                  maxLength={200}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your feedback in detail..."
                  required
                  rows={6}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.message.length}/5000
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>

              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                    Sign in
                  </Button>
                  {' '}to track your feedback and receive updates.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Feedback;
