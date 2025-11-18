'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import { useLightbox } from '@/hooks/useLightbox';
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
          console.log('📸 Loaded images:', imagesData.length, 'images');
          console.log('Sample image:', imagesData[0]);
          setImages(imagesData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('📂 Loaded categories:', categoriesData);
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

  const filteredImages = useMemo(() => {
    console.log('🔍 Filtering with category:', selectedCategory);

    if (selectedCategory === 'all') {
      console.log('✅ Showing all images:', images.length);
      return images;
    }

    const filtered = images.filter((img) => {
      const matches = img.categorySlug === selectedCategory;
      if (!matches) {
        console.log(`❌ Image "${img.title}" has categorySlug="${img.categorySlug}", expected="${selectedCategory}"`);
      }
      return matches;
    });

    console.log(`✅ Filtered to ${filtered.length} images for category "${selectedCategory}"`);
    return filtered;
  }, [images, selectedCategory]);

  const lightbox = useLightbox(filteredImages);

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
    <>
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
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white'
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
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white'
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
              {filteredImages.map((image, index) => (
                <ImageCard
                  key={image._id?.toString() || image.id}
                  image={image}
                  onClick={() => lightbox.open(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        images={filteredImages}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrevious={lightbox.previous}
      />
    </>
  );
}
