
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PosterUploadProps } from '@/types/forms';
import { Upload, X } from 'lucide-react';

export const PosterUpload: React.FC<PosterUploadProps> = ({
  posterImage,
  setPosterImage,
  posterUrl,
  setPosterUrl
}) => {
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPosterImage(e.target.files[0]);
      
      // Create a temporary URL for preview
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setPosterUrl(fileUrl);
    }
  }, [setPosterImage, setPosterUrl]);

  const removeImage = useCallback(() => {
    setPosterImage(null);
    setPosterUrl('');
  }, [setPosterImage, setPosterUrl]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="posterUpload">Event Poster</Label>
        
        {posterUrl ? (
          <div className="relative border rounded-md overflow-hidden">
            <img 
              src={posterUrl} 
              alt="Event poster" 
              className="max-h-64 w-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag and drop your poster image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Recommended size: 1200 x 600px (2:1 ratio)
            </p>
            <input
              id="posterUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById('posterUpload')?.click()}
            >
              Upload Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterUpload;
