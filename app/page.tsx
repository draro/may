import HeroSection from '@/components/layout/HeroSection';
import FeaturedGallery from '@/components/gallery/FeaturedGallery';
import SkillsSection from '@/components/layout/SkillsSection';
import CTASection from '@/components/layout/CTASection';
import clientPromise from '@/lib/db/mongodb';
import { SiteConfig } from '@/models/SiteConfig';

async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const config = await db.collection<SiteConfig>('siteConfig').findOne({});
    return config;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return null;
  }
}

export default async function Home() {
  const config = await getSiteConfig();
  const showHero = config?.hero?.enabled ?? true; // Default to true if config not found

  return (
    <main className="min-h-screen">
      {showHero && <HeroSection />}
      <FeaturedGallery />
      <SkillsSection />
      <CTASection />
    </main>
  );
}
