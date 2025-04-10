
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';

export interface ScreenshotGalleryProps {
  screenshots: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
      
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {screenshots.map((screenshot, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col p-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-video relative overflow-hidden rounded-t-lg group cursor-pointer">
                          <img 
                            src={screenshot.src} 
                            alt={screenshot.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="text-white h-8 w-8" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full p-1">
                        <img 
                          src={screenshot.src} 
                          alt={screenshot.alt}
                          className="w-full h-auto object-contain"
                        />
                      </DialogContent>
                    </Dialog>
                    <div className="p-4">
                      <h3 className="font-semibold">{screenshot.alt}</h3>
                      {screenshot.title && (
                        <p className="text-sm text-muted-foreground mt-1">{screenshot.title}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 -translate-x-1/2" />
        <CarouselNext className="absolute right-0 translate-x-1/2" />
      </Carousel>
    </div>
  );
};

export default ScreenshotGallery;
