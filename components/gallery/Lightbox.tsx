'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageType } from '@/types';

interface LightboxProps {
  images: ImageType[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const currentImage = images[currentIndex];
  const previousIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;
  const previousImage = images[previousIndex];
  const nextImage = images[nextIndex];

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
      }
    },
    [isOpen, onClose, onNext, onPrevious]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 dark:bg-black/98"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close lightbox"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-center h-full p-4 md:p-8 pb-32">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Previous button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
                  className="absolute left-0 md:left-4 z-40 p-2 md:p-3 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* Image */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-w-full max-h-[65vh] flex items-center justify-center">
                  <img
                    src={currentImage.firebaseUrl}
                    alt={currentImage.title}
                    className="max-w-full max-h-[65vh] w-auto h-auto object-contain"
                  />
                </div>

                {/* Image info */}
                <div className="mt-4 text-center text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">
                    {currentImage.title}
                  </h3>
                  {currentImage.description && (
                    <p className="text-sm md:text-base text-gray-300 mb-1">
                      {currentImage.description}
                    </p>
                  )}
                  {currentImage.location && (
                    <p className="text-xs md:text-sm text-gray-400">
                      {currentImage.location}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Next button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-0 md:right-4 z-40 p-2 md:p-3 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 px-4">
                {/* Previous thumbnail */}
                {previousImage && (
                  <button
                    onClick={onPrevious}
                    className="group relative overflow-hidden transition-all hover:scale-105"
                    aria-label="Previous image"
                  >
                    <div className="w-20 h-16 md:w-24 md:h-20 relative">
                      <img
                        src={previousImage.firebaseUrl}
                        alt={previousImage.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 border-2 border-white/30 group-hover:border-white/60 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white opacity-70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white text-xs mt-1 text-center opacity-70 group-hover:opacity-100 transition-opacity truncate max-w-[80px] md:max-w-[96px]">
                      {previousImage.title}
                    </p>
                  </button>
                )}

                {/* Current indicator */}
                <div className="w-1 h-16 md:h-20 bg-white/50 rounded-full" />

                {/* Next thumbnail */}
                {nextImage && (
                  <button
                    onClick={onNext}
                    className="group relative overflow-hidden transition-all hover:scale-105"
                    aria-label="Next image"
                  >
                    <div className="w-20 h-16 md:w-24 md:h-20 relative">
                      <img
                        src={nextImage.firebaseUrl}
                        alt={nextImage.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 border-2 border-white/30 group-hover:border-white/60 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white opacity-70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white text-xs mt-1 text-center opacity-70 group-hover:opacity-100 transition-opacity truncate max-w-[80px] md:max-w-[96px]">
                      {nextImage.title}
                    </p>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs text-center">
            <p className="hidden md:block">
              Use arrow keys to navigate • ESC to close
            </p>
            <p className="md:hidden">
              Tap thumbnails or swipe • Tap outside to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
