'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import { useLightbox } from '@/hooks/useLightbox';
import { Image as ImageType } from '@/types';

export default function FeaturedGallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const lightbox = useLightbox(images);

  useEffect(() => {
    async function fetchFeaturedImages() {
      try {
        const response = await fetch('/api/images/featured');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching featured images:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedImages();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Featured Work
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Featured Work
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Curated selection of recent projects. Gallery coming soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Featured Work
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Curated selection of recent projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <ImageCard
                key={image._id?.toString() || image.id}
                image={image}
                onClick={() => lightbox.open(index)}
              />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/gallery"
              className="inline-block px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-none hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors uppercase text-sm tracking-wider font-medium"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrevious={lightbox.previous}
      />
    </>
  );
}
