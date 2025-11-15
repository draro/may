'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SiteConfig } from '@/models/SiteConfig';

export default function HeroSection() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('Error fetching config:', err));
  }, []);

  if (!config) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {config.hero.title}
            <br />
            <span className="text-gray-600 dark:text-gray-400">{config.hero.subtitle}</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          {config.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href={config.hero.primaryButtonLink}
            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors uppercase text-sm tracking-wider font-medium"
          >
            {config.hero.primaryButtonText}
          </Link>
          <Link
            href={config.hero.secondaryButtonLink}
            className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-none hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors uppercase text-sm tracking-wider font-medium"
          >
            {config.hero.secondaryButtonText}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex justify-center gap-6"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{config.stats.projects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">{config.stats.projectsLabel}</div>
          </div>
          <div className="w-px bg-gray-300 dark:bg-gray-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{config.stats.years}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">{config.stats.yearsLabel}</div>
          </div>
          <div className="w-px bg-gray-300 dark:bg-gray-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{config.stats.location}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">{config.stats.locationLabel}</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gray-400 dark:bg-gray-600"
          />
        </div>
      </motion.div>
    </section>
  );
}
