'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Image as ImageType } from '@/types';

interface ImageCardProps {
  image: ImageType;
  onClick?: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    // Detect if device supports touch
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // On touch devices, show colors when in view; on desktop, show on hover
  const shouldShowColors = isTouchDevice ? isInView : isHovered;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-800"
      style={{ aspectRatio: '4/3' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <img
          src={image.firebaseUrl || '/placeholder-image.jpg'}
          alt={image.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            shouldShowColors ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
          }`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            shouldShowColors ? 'opacity-0' : 'opacity-10'
          }`}
        />

        {/* Info Overlay - Only show on hover for desktop, always hidden on mobile */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 ${
            isHovered && !isTouchDevice ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 transform transition-transform duration-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {image.title}
            </h3>
            {image.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {image.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {image.categorySlug}
              </span>
              {image.location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{image.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
