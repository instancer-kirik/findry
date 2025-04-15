import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image, Upload } from 'lucide-react';

interface PosterUploadProps {
  posterImage: File | null;
  setPosterImage: (file: File | null) => void;
  posterUrl: string;
  setPosterUrl: (url: string) => void;
}

const PosterUpload: React.FC<PosterUploadProps> = ({
  posterImage,
  setPosterImage,
  posterUrl,
  setPosterUrl
}) => {
  const handlePosterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setPosterImage(file);
    
    const url = URL.createObjectURL(file);
    setPosterUrl(url);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Event Poster</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="posterImage">Upload Poster Image</Label>
          <div className="mt-2 flex items-center gap-4">
            <Label 
              htmlFor="posterUpload" 
              className="cursor-pointer flex h-10 items-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Label>
            <Input 
              id="posterUpload"
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              className="hidden"
            />
            <span className="text-sm text-muted-foreground">
              {posterImage ? posterImage.name : "No file chosen"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Recommended size: 1200x630 pixels (16:9 ratio)
          </p>
        </div>
        
        <div>
          {posterUrl ? (
            <div className="aspect-video rounded-md overflow-hidden bg-muted">
              <img 
                src={posterUrl} 
                alt="Event poster preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="aspect-video rounded-md flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <Image className="h-8 w-8 mx-auto mb-2" />
                <p>Poster preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PosterUpload; 