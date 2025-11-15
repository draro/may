import { Metadata } from 'next';
import GalleryClient from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
  title: 'Photography Gallery | Architecture, Interiors & Travel',
  description: 'Browse through our collection of professional photography featuring architecture, interior design, travel, and more. High-quality commercial photography based in NYC.',
  openGraph: {
    title: 'Photography Gallery',
    description: 'Professional photography portfolio featuring architecture, interiors, and travel photography',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
