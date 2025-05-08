import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, Check, X, Download, Info } from "lucide-react";
import { ContentItemProps } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

interface ImportedArtist {
  name: string;
  location: string;
  tags: string[];
  subtype: string;
  styles?: string[];
  disciplines?: string[];
  email?: string;
}

interface ArtistBulkImportProps {
  onImportComplete?: (artists: ContentItemProps[]) => void;
}

const ArtistBulkImport: React.FC<ArtistBulkImportProps> = ({ onImportComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedArtists, setParsedArtists] = useState<ContentItemProps[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        const artists = parseCSV(csvContent);
        setParsedArtists(artists);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setParseError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setParseError('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  const parseCSV = (csvContent: string): ContentItemProps[] => {
    const lines = csvContent.split('\n');
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or has only headers');
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Validate required headers
    const requiredHeaders = ['name', 'location', 'tags', 'subtype'];
    for (const header of requiredHeaders) {
      if (!headers.includes(header)) {
        throw new Error(`Missing required header: ${header}`);
      }
    }
    
    const artists: ContentItemProps[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        throw new Error(`Line ${i+1} has ${values.length} values, but ${headers.length} were expected`);
      }
      
      const artistData: Record<string, any> = {};
      headers.forEach((header, index) => {
        artistData[header] = values[index];
      });
      
      const artist: ContentItemProps = {
        id: uuidv4(),
        name: artistData.name,
        type: 'artist',
        location: artistData.location,
        subtype: artistData.subtype,
        tags: artistData.tags.split(';').map((t: string) => t.trim()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add optional fields
      if (artistData.styles) {
        artist.styles = artistData.styles.split(';').map((s: string) => s.trim());
      }
      
      if (artistData.disciplines) {
        artist.disciplines = artistData.disciplines.split(';').map((d: string) => d.trim());
      }
      
      if (artistData.multidisciplinary) {
        artist.multidisciplinary = artistData.multidisciplinary.toLowerCase() === 'true';
      }
      
      if (artistData.email) {
        artist.email = artistData.email;
      }
      
      if (artistData.description) {
        artist.description = artistData.description;
      }
      
      if (artistData.image_url) {
        artist.image_url = artistData.image_url;
      }
      
      artists.push(artist);
    }
    
    return artists;
  };
  
  // Helper function to correctly parse CSV line (handles quoted cells)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last field
    return result.map(value => value.trim().replace(/^"|"$/g, ''));
  };

  const handleSubmit = () => {
    if (parsedArtists.length > 0 && onImportComplete) {
      onImportComplete(parsedArtists);
      // Reset the form
      setParsedArtists([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDownloadTemplate = () => {
    const template = 'name,location,tags,subtype,styles,disciplines,multidisciplinary,email,description,image_url\n"Artist Name","City, State","Tag1;Tag2;Tag3","Vocalist","Style1;Style2","Discipline1;Discipline2",true,email@example.com,"Artist description",https://example.com/image.jpg';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artist_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Import Artists</CardTitle>
        <CardDescription>
          Import multiple artists at once using CSV file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
            
            <div className="border rounded-md p-6 flex flex-col items-center justify-center gap-4">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Click to upload a CSV file or drag and drop it here
              </p>
              <Button 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv" 
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {parseError && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            
            {parsedArtists.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to Import</AlertTitle>
                <AlertDescription>
                  {parsedArtists.length} artists parsed successfully and ready to import.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          {parsedArtists.length > 0 
            ? `${parsedArtists.length} artists ready to import` 
            : 'No artists parsed yet'}
        </p>
        <Button 
          onClick={handleSubmit}
          disabled={parsedArtists.length === 0}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Import Artists
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtistBulkImport;
