import { Metadata } from 'next';
import ContactClient from '@/components/layout/ContactClient';

export const metadata: Metadata = {
  title: 'Contact | Get in Touch for Your Next Project',
  description: 'Contact our NYC-based professional photographer for your next project. Specializing in architecture, interior design, and travel photography. Available for commercial and editorial work.',
  openGraph: {
    title: 'Contact Us',
    description: 'Get in touch for your next photography project',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
