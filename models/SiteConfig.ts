import { ObjectId } from 'mongodb';

export interface SiteConfig {
  _id?: ObjectId;
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Hero Section
  hero: {
    enabled: boolean;
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };

  // Stats
  stats: {
    projects: string;
    projectsLabel: string;
    years: string;
    yearsLabel: string;
    location: string;
    locationLabel: string;
  };

  // About
  about: {
    title: string;
    subtitle: string;
    bio: string;
    skills: string[];
  };

  // Contact
  contact: {
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      facebook?: string;
    };
  };

  // Footer
  footer: {
    copyrightText: string;
    tagline: string;
  };

  updatedAt: Date;
}
