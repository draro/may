'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Let's Create Something Amazing
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Looking for a professional photographer for your next project?
            I'd love to hear about your vision and bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-none hover:bg-gray-100 transition-colors uppercase text-sm tracking-wider font-medium"
            >
              Start a Project
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 border-2 border-white text-white rounded-none hover:bg-white dark:bg-gray-900 hover:text-gray-900 dark:text-white transition-colors uppercase text-sm tracking-wider font-medium"
            >
              View More Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
