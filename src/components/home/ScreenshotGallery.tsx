
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageModal from '../ui-custom/ImageModal';
import { Smartphone } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: {
    src: string;
    alt: string;
    title?: string;
  }[];
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots = [] }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [aspectRatios, setAspectRatios] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!screenshots || screenshots.length === 0) return;
    
    screenshots.forEach((screenshot, index) => {
      const img = new Image();
      img.src = screenshot.src;
      img.onload = () => {
        const ratio = img.width / img.height;
        setAspectRatios(prev => ({ ...prev, [index]: ratio }));
      };
    });
  }, [screenshots]);

  const getAspectRatioClass = (index: number) => {
    const ratio = aspectRatios[index];
    if (!ratio) return 'aspect-[16/9]'; // Default fallback
    
    // If ratio is less than 1, it's portrait (mobile)
    if (ratio < 1) return 'aspect-[9/16]';
    // If ratio is close to 1, it's square
    if (ratio >= 0.9 && ratio <= 1.1) return 'aspect-square';
    // Otherwise, it's landscape
    return 'aspect-[16/9]';
  };

  // Guard against undefined or empty screenshots
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  // Group screenshots into desktop and mobile based on aspect ratios
  const desktopScreenshots = Object.keys(aspectRatios).length > 0
    ? screenshots.filter((_, index) => aspectRatios[index] && aspectRatios[index] >= 1)
    : [];
    
  const mobileScreenshots = Object.keys(aspectRatios).length > 0
    ? screenshots.filter((_, index) => aspectRatios[index] && aspectRatios[index] < 1)
    : [];

  return (
    <>
      <div className="space-y-6">
        {/* Desktop Screenshots Row */}
        {desktopScreenshots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {desktopScreenshots.map((screenshot, index) => {
              const originalIndex = screenshots.indexOf(screenshot);
              return (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: originalIndex * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-black/80 shadow-xl border border-white/30 dark:border-white/10 cursor-pointer aspect-[16/9]"
                  onClick={() => setSelectedImage(originalIndex)}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {screenshot.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">{screenshot.title}</h3>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile Screenshots Row */}
        {mobileScreenshots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mobileScreenshots.map((screenshot, index) => {
              const originalIndex = screenshots.indexOf(screenshot);
              return (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: originalIndex * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-black/80 shadow-xl border border-white/30 dark:border-white/10 cursor-pointer aspect-[9/16]"
                  onClick={() => setSelectedImage(originalIndex)}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  {screenshot.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">{screenshot.title}</h3>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* If no images have been measured yet, show loading state */}
        {screenshots.length > 0 && Object.keys(aspectRatios).length === 0 && (
          <div className="flex justify-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-48 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-24 w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        )}
      </div>

      {selectedImage !== null && (
        <ImageModal
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
          image={selectedImage !== null ? {
            ...screenshots[selectedImage],
            aspectRatio: aspectRatios[selectedImage]
          } : screenshots[0]}
        />
      )}
    </>
  );
};

export default ScreenshotGallery;
