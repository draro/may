'use client';

import { useState, useEffect } from 'react';
import { SiteConfig } from '@/models/SiteConfig';

export default function SiteSettings() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState<'seo' | 'hero' | 'stats' | 'about' | 'contact' | 'footer'>('seo');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/site-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (!config) {
    return <div className="text-center py-8">Failed to load settings</div>;
  }

  const sections = [
    { id: 'seo', label: 'SEO' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'stats', label: 'Statistics' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'footer', label: 'Footer' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 -mb-px whitespace-nowrap ${
                activeSection === section.id
                  ? 'border-b-2 border-gray-900 dark:border-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* SEO Section */}
          {activeSection === 'seo' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Site Title</label>
                <input
                  type="text"
                  value={config.seo.title}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, title: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  value={config.seo.description}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={config.seo.keywords.join(', ')}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, keywords: e.target.value.split(',').map(k => k.trim()) } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hero Section</h3>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <input
                  id="hero-enabled"
                  type="checkbox"
                  checked={config.hero.enabled}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, enabled: e.target.checked } })}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <label htmlFor="hero-enabled" className="ml-2 text-sm font-medium">
                  Show Hero Section on Homepage
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Main Title</label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={config.hero.subtitle}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={config.hero.description}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={config.hero.primaryButtonText}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, primaryButtonText: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Link</label>
                  <input
                    type="text"
                    value={config.hero.primaryButtonLink}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, primaryButtonLink: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={config.hero.secondaryButtonText}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, secondaryButtonText: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Link</label>
                  <input
                    type="text"
                    value={config.hero.secondaryButtonLink}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, secondaryButtonLink: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {activeSection === 'stats' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statistics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Projects Count</label>
                  <input
                    type="text"
                    value={config.stats.projects}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, projects: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Projects Label</label>
                  <input
                    type="text"
                    value={config.stats.projectsLabel}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, projectsLabel: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Years</label>
                  <input
                    type="text"
                    value={config.stats.years}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, years: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Years Label</label>
                  <input
                    type="text"
                    value={config.stats.yearsLabel}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, yearsLabel: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={config.stats.location}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, location: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location Label</label>
                  <input
                    type="text"
                    value={config.stats.locationLabel}
                    onChange={(e) => setConfig({ ...config, stats: { ...config.stats, locationLabel: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About Section</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={config.about.title}
                    onChange={(e) => setConfig({ ...config, about: { ...config.about, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={config.about.subtitle}
                    onChange={(e) => setConfig({ ...config, about: { ...config.about, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={config.about.bio}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, bio: e.target.value } })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={config.about.skills.join(', ')}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, skills: e.target.value.split(',').map(s => s.trim()) } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={config.contact.phone}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={config.contact.address}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, address: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <h4 className="text-md font-semibold mt-6">Social Links</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram</label>
                  <input
                    type="url"
                    value={config.contact.socialLinks.instagram || ''}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, socialLinks: { ...config.contact.socialLinks, instagram: e.target.value } } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter</label>
                  <input
                    type="url"
                    value={config.contact.socialLinks.twitter || ''}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, socialLinks: { ...config.contact.socialLinks, twitter: e.target.value } } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={config.contact.socialLinks.linkedin || ''}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, socialLinks: { ...config.contact.socialLinks, linkedin: e.target.value } } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook</label>
                  <input
                    type="url"
                    value={config.contact.socialLinks.facebook || ''}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, socialLinks: { ...config.contact.socialLinks, facebook: e.target.value } } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Section */}
          {activeSection === 'footer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Footer</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Copyright Text</label>
                <input
                  type="text"
                  value={config.footer.copyrightText}
                  onChange={(e) => setConfig({ ...config, footer: { ...config.footer, copyrightText: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={config.footer.tagline}
                  onChange={(e) => setConfig({ ...config, footer: { ...config.footer, tagline: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mt-6 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium uppercase tracking-wider"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
