import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Video, Link, X, Loader2 } from 'lucide-react';
import { useUGC } from '@/hooks/use-ugc';
import { cn } from '@/lib/utils';

interface UGCUploadModalProps {
  trigger?: React.ReactNode;
  eventId?: string;
  venueId?: string;
  artistId?: string;
  brandId?: string;
  onSuccess?: () => void;
}

export function UGCUploadModal({ 
  trigger, 
  eventId, 
  venueId, 
  artistId, 
  brandId,
  onSuccess 
}: UGCUploadModalProps) {
  const [open, setOpen] = useState(false);
  const [contentType, setContentType] = useState<'image' | 'video' | 'embed'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { createContent } = useUGC();

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    // Auto-detect content type
    if (selectedFile.type.startsWith('image/')) {
      setContentType('image');
    } else if (selectedFile.type.startsWith('video/')) {
      setContentType('video');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (contentType === 'embed' && !embedUrl) return;
    if ((contentType === 'image' || contentType === 'video') && !file) return;

    await createContent.mutateAsync({
      file: file || undefined,
      uploadData: {
        content_type: contentType,
        title: title || undefined,
        description: description || undefined,
        tags,
        url: contentType === 'embed' ? embedUrl : undefined,
        event_id: eventId,
        venue_id: venueId,
        artist_id: artistId,
        brand_id: brandId,
      }
    });

    // Reset form
    setFile(null);
    setPreview(null);
    setEmbedUrl('');
    setTitle('');
    setDescription('');
    setTags([]);
    setOpen(false);
    onSuccess?.();
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setEmbedUrl('');
    setTitle('');
    setDescription('');
    setTags([]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Content
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Content</DialogTitle>
        </DialogHeader>

        <Tabs value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Photo
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <DropZone
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              preview={preview}
              accept="image/*"
              label="Drop an image or click to upload"
            />
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <DropZone
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              preview={preview}
              isVideo
              accept="video/*"
              label="Drop a video or click to upload"
            />
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-2">
              <Label>Embed URL</Label>
              <Input
                placeholder="https://youtube.com/watch?v=... or spotify.com/track/..."
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Supports YouTube, Vimeo, Spotify, SoundCloud, and more
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input
              placeholder="Give your content a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="What's this about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createContent.isPending || (contentType === 'embed' ? !embedUrl : !file)}
          >
            {createContent.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DropZone({
  isDragging,
  setIsDragging,
  onDrop,
  onFileSelect,
  preview,
  isVideo,
  accept,
  label
}: {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
  preview: string | null;
  isVideo?: boolean;
  accept: string;
  label: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        preview && "p-4"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <div className="relative">
          {isVideo ? (
            <video src={preview} className="w-full max-h-64 object-contain rounded" controls />
          ) : (
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded" />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Max 50MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  );
}
