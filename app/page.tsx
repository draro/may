import HeroSection from '@/components/layout/HeroSection';
import FeaturedGallery from '@/components/gallery/FeaturedGallery';
import SkillsSection from '@/components/layout/SkillsSection';
import CTASection from '@/components/layout/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedGallery />
      <SkillsSection />
      <CTASection />
    </main>
  );
}
