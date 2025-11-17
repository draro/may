import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteConfig } from '@/models/SiteConfig';

// GET - Fetch site configuration
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');

    let config = await db.collection<SiteConfig>('siteConfig').findOne({});

    // Default configuration values
    const defaultConfig: Omit<SiteConfig, '_id'> = {
      seo: {
        title: 'NYC Professional Photographer | Architecture, Interiors & Travel Photography',
        description: 'Award-winning NYC-based photographer specializing in architectural photography, interior design, and travel documentation. Available for commercial and editorial projects.',
        keywords: ['photographer', 'NYC photographer', 'architecture photography', 'interior photography', 'travel photography', 'commercial photographer', 'New York'],
      },
      hero: {
        enabled: true,
        title: 'Visual Stories',
        subtitle: 'Through the Lens',
        description: 'NYC-based photographer specializing in architecture, interiors, and travel photography. Capturing moments that matter.',
        primaryButtonText: 'View Portfolio',
        primaryButtonLink: '/gallery',
        secondaryButtonText: 'Get in Touch',
        secondaryButtonLink: '/contact',
      },
      stats: {
        projects: '500+',
        projectsLabel: 'Projects',
        years: '10+',
        yearsLabel: 'Years',
        location: 'NYC',
        locationLabel: 'Based',
      },
      about: {
        title: 'About Me',
        subtitle: 'Professional Photographer',
        bio: 'I am a professional photographer based in New York City, specializing in architecture, interior design, and travel photography. With over a decade of experience, I bring a unique perspective to every project.',
        skills: ['Architecture Photography', 'Interior Design', 'Travel Photography', 'Commercial Projects', 'Editorial Work'],
        interests: ['Urban Exploration', 'Minimalist Design', 'Street Photography', 'Documentary Work', 'Fine Art'],
      },
      contact: {
        email: 'hello@photographer.com',
        phone: '+1 (555) 123-4567',
        address: 'New York, NY',
        socialLinks: {
          instagram: 'https://instagram.com/photographer',
          twitter: 'https://twitter.com/photographer',
          linkedin: 'https://linkedin.com/in/photographer',
        },
      },
      footer: {
        copyrightText: '© 2024 Professional Photographer. All rights reserved.',
        tagline: 'Capturing moments that matter',
      },
      theme: {
        fonts: {
          headingFont: 'Playfair Display',
          bodyFont: 'Inter',
          logoFont: 'Playfair Display',
        },
        lightMode: {
          primaryColor: '#111827', // gray-900
          backgroundColor: '#ffffff',
          textColor: '#111827',
          accentColor: '#6b7280', // gray-500
        },
        darkMode: {
          primaryColor: '#ffffff',
          backgroundColor: '#111827', // gray-900
          textColor: '#f9fafb', // gray-50
          accentColor: '#9ca3af', // gray-400
        },
      },
      updatedAt: new Date(),
    };

    // If no config exists, create default
    if (!config) {
      const result = await db.collection('siteConfig').insertOne(defaultConfig);
      config = { ...defaultConfig, _id: result.insertedId };
    } else {
      // Merge existing config with defaults to ensure all properties exist
      const mergedConfig: any = {
        ...defaultConfig,
        ...config,
        hero: {
          ...defaultConfig.hero,
          ...(config.hero || {}),
          // Ensure enabled property exists
          enabled: config.hero?.enabled !== undefined ? config.hero.enabled : defaultConfig.hero.enabled,
        },
        theme: {
          fonts: {
            ...defaultConfig.theme.fonts,
            ...(config.theme?.fonts || {}),
          },
          lightMode: {
            ...defaultConfig.theme.lightMode,
            ...(config.theme?.lightMode || {}),
          },
          darkMode: {
            ...defaultConfig.theme.darkMode,
            ...(config.theme?.darkMode || {}),
          },
        },
      };
      config = mergedConfig;
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: 'Failed to fetch site configuration' }, { status: 500 });
  }
}

// PUT - Update site configuration
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    delete updateData._id;

    const result = await db.collection('siteConfig').findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: 'Failed to update site configuration' }, { status: 500 });
  }
}
