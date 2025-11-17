'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SkillsData {
  skills: string[];
  interests: string[];
}

export default function SkillsSection() {
  const [data, setData] = useState<SkillsData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/site-config');
        if (response.ok) {
          const config = await response.json();
          setData({
            skills: config.about?.skills || [],
            interests: config.about?.interests || [],
          });
        }
      } catch (error) {
        console.error('Error fetching skills data:', error);
      }
    }

    fetchData();
  }, []);

  const defaultSkills = [
    'Architectural Photography',
    'Interior Design Photography',
    'Travel Photography',
    'Commercial Photography',
    'Photo Editing & Retouching',
    'Drone Photography'
  ];

  const defaultInterests = [
    'Urban Landscapes',
    'Modern Architecture',
    'Minimalist Design',
    'Cultural Documentation',
    'Light & Shadow'
  ];

  const skills = data?.skills && data.skills.length > 0 ? data.skills : defaultSkills;
  const interests = data?.interests && data.interests.length > 0 ? data.interests : defaultInterests;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              Skills & Expertise
            </h2>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-2 h-2 bg-gray-900 dark:bg-white group-hover:w-8 transition-all duration-300" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              Areas of Interest
            </h2>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 text-sm uppercase tracking-wider cursor-default"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
