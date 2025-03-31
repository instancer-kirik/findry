import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    alt: string;
    title?: string;
    aspectRatio?: number;
  };
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image }) => {
  const isPortrait = image.aspectRatio && image.aspectRatio < 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative ${
              isPortrait ? 'max-h-[90vh] w-auto' : 'max-w-7xl w-full max-h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <img
                src={image.src}
                alt={image.alt}
                className={`${
                  isPortrait ? 'h-[90vh] w-auto' : 'w-full h-auto'
                } object-contain`}
              />
              {isPortrait && (
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              )}
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-medium">{image.title}</h3>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal; 