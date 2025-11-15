'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageCard from './ImageCard';
import { Image as ImageType, Category } from '@/types';

export default function GalleryClient() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [imagesRes, categoriesRes] = await Promise.all([
          fetch('/api/images'),
          fetch('/api/categories'),
        ]);

        if (imagesRes.ok) {
          const imagesData = await imagesRes.json();
          setImages(imagesData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching gallery data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.categorySlug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Loading Gallery...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our curated collection of photography
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id?.toString() || category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 text-sm uppercase tracking-wider transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400">
              {selectedCategory === 'all'
                ? 'No images yet. Check back soon!'
                : 'No images in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <ImageCard key={image._id?.toString() || image.id} image={image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
