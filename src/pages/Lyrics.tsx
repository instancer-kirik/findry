import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLyrics, Lyric } from '@/hooks/use-lyrics';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Music, FileText, Trash2, Edit, Clock, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/20 text-primary',
  complete: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const LyricsPage = () => {
  const { user } = useAuth();
  const { lyrics, loading, createLyric, updateLyric, deleteLyric } = useLyrics();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', status: 'draft', key_signature: '', tempo_bpm: '', mood: '', notes: '', tags: '' });

  const resetForm = () => setForm({ title: '', content: '', status: 'draft', key_signature: '', tempo_bpm: '', mood: '', notes: '', tags: '' });

  const handleCreate = async () => {
    try {
      await createLyric({
        title: form.title || 'Untitled',
        content: form.content,
        status: form.status,
        key_signature: form.key_signature || null,
        tempo_bpm: form.tempo_bpm ? parseInt(form.tempo_bpm) : null,
        mood: form.mood || null,
        notes: form.notes || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      });
      toast({ title: 'Lyrics created' });
      setCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await updateLyric(editingId, {
        title: form.title,
        content: form.content,
        status: form.status,
        key_signature: form.key_signature || null,
        tempo_bpm: form.tempo_bpm ? parseInt(form.tempo_bpm) : null,
        mood: form.mood || null,
        notes: form.notes || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      });
      toast({ title: 'Lyrics updated' });
      setEditingId(null);
      resetForm();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const openEdit = (lyric: Lyric) => {
    setForm({
      title: lyric.title,
      content: lyric.content,
      status: lyric.status,
      key_signature: lyric.key_signature || '',
      tempo_bpm: lyric.tempo_bpm?.toString() || '',
      mood: lyric.mood || '',
      notes: lyric.notes || '',
      tags: lyric.tags?.join(', ') || '',
    });
    setEditingId(lyric.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLyric(id);
      toast({ title: 'Lyrics deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const LyricForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      <Textarea
        placeholder="Write your lyrics here..."
        className="min-h-[200px] font-mono"
        value={form.content}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Key (e.g. Am, C major)" value={form.key_signature} onChange={e => setForm(f => ({ ...f, key_signature: e.target.value }))} />
        <Input placeholder="Tempo BPM" type="number" value={form.tempo_bpm} onChange={e => setForm(f => ({ ...f, tempo_bpm: e.target.value }))} />
        <Input placeholder="Mood (e.g. melancholic)" value={form.mood} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))} />
      </div>
      <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
      <Textarea placeholder="Notes..." className="min-h-[60px]" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <Button onClick={onSubmit} className="w-full">{submitLabel}</Button>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Music className="h-8 w-8 text-primary" />
              Lyrics Notebook
            </h1>
            <p className="text-muted-foreground mt-1">Write, organize, and collaborate on lyrics for your music projects.</p>
          </div>
          {user && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />New Lyrics</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create New Lyrics</DialogTitle></DialogHeader>
                <LyricForm onSubmit={handleCreate} submitLabel="Create" />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {!user && (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Log in to create and manage your lyrics.</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : lyrics.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No lyrics yet. Start writing!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lyrics.map(lyric => (
              <Card key={lyric.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{lyric.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={statusColors[lyric.status] || ''}>{lyric.status}</Badge>
                        {lyric.key_signature && <Badge variant="outline">{lyric.key_signature}</Badge>}
                        {lyric.tempo_bpm && <Badge variant="outline">{lyric.tempo_bpm} BPM</Badge>}
                        {lyric.mood && <Badge variant="outline">{lyric.mood}</Badge>}
                      </div>
                    </div>
                    {user?.id === lyric.user_id && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(lyric)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lyric.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground/80 bg-muted/50 rounded-md p-3 max-h-48 overflow-y-auto">
                    {lyric.content || '(empty)'}
                  </pre>
                  {lyric.tags && lyric.tags.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground mt-0.5" />
                      {lyric.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  {lyric.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">{lyric.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(lyric.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingId} onOpenChange={open => { if (!open) { setEditingId(null); resetForm(); } }}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Lyrics</DialogTitle></DialogHeader>
            <LyricForm onSubmit={handleUpdate} submitLabel="Save Changes" />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default LyricsPage;
