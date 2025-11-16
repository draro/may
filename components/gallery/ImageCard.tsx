'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageType } from '@/types';

interface ImageCardProps {
  image: ImageType;
  onClick?: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden cursor-pointer bg-gray-100"
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
            isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
          }`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-10'
          }`}
        />

        {/* Info Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-sm p-4 transform transition-transform duration-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {image.title}
            </h3>
            {image.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {image.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                {image.categorySlug}
              </span>
              {image.location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{image.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
