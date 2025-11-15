import { Metadata } from 'next';
import AboutClient from '@/components/layout/AboutClient';

export const metadata: Metadata = {
  title: 'About | Professional NYC Photographer',
  description: 'Learn more about our NYC-based professional photographer specializing in architecture, interior design, and travel photography. Experience, skills, and creative vision.',
  openGraph: {
    title: 'About the Photographer',
    description: 'NYC-based professional photographer with expertise in architecture, interiors, and travel photography',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
