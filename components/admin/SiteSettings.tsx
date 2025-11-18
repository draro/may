'use client';

import { useState, useEffect } from 'react';
import { SiteConfig } from '@/models/SiteConfig';
import FontPicker from './FontPicker';

export default function SiteSettings() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState<'seo' | 'analytics' | 'hero' | 'stats' | 'about' | 'contact' | 'footer' | 'theme'>('seo');

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
    { id: 'analytics', label: 'Analytics' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'stats', label: 'Statistics' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'footer', label: 'Footer' },
    { id: 'theme', label: 'Theme & Colors' },
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
              <div>
                <label className="block text-sm font-medium mb-2">Favicon URL</label>
                <input
                  type="text"
                  value={config.seo.favicon || ''}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, favicon: e.target.value } })}
                  placeholder="/favicon.ico or full URL to favicon"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Upload your favicon to the Upload tab, then paste the URL here. Recommended: .ico, .png, or .svg (16x16 or 32x32 pixels)
                </p>
                {config.seo.favicon && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <img
                      src={config.seo.favicon}
                      alt="Favicon preview"
                      className="w-8 h-8"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Preview</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analytics & Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add Google Analytics and Google Tag Manager to track visitor behavior and conversions.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="text-md font-semibold mb-4">Google Analytics 4 (GA4)</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Measurement ID
                    <span className="text-gray-500 font-normal ml-2">(e.g., G-XXXXXXXXXX)</span>
                  </label>
                  <input
                    type="text"
                    value={config.analytics?.googleAnalyticsId || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      analytics: {
                        ...config.analytics,
                        googleAnalyticsId: e.target.value
                      }
                    })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Find this in Google Analytics: Admin → Data Streams → Select your stream → Measurement ID
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="text-md font-semibold mb-4">Google Tag Manager (GTM)</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Container ID
                    <span className="text-gray-500 font-normal ml-2">(e.g., GTM-XXXXXXX)</span>
                  </label>
                  <input
                    type="text"
                    value={config.analytics?.googleTagManagerId || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      analytics: {
                        ...config.analytics,
                        googleTagManagerId: e.target.value
                      }
                    })}
                    placeholder="GTM-XXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Find this in Google Tag Manager: Admin → Container ID (top right)
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> If you use Google Tag Manager, you can manage Google Analytics through GTM and don't need to fill in both fields. GTM is recommended for advanced tracking setups.
                </p>
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
                <label className="block text-sm font-medium mb-2">Skills & Expertise (comma-separated)</label>
                <input
                  type="text"
                  value={config.about.skills.join(', ')}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  placeholder="e.g., Architecture Photography, Interior Design, Travel Photography"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Areas of Interest (comma-separated)</label>
                <input
                  type="text"
                  value={config.about.interests?.join(', ') || ''}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, interests: e.target.value.split(',').map(s => s.trim()).filter(s => s) } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                  placeholder="e.g., Urban Exploration, Minimalist Design, Street Photography"
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

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Theme & Styling</h3>

              {/* Fonts */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="text-md font-semibold mb-4">Fonts</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <FontPicker
                    value={config.theme.fonts.headingFont}
                    onChange={(font) => setConfig({ ...config, theme: { ...config.theme, fonts: { ...config.theme.fonts, headingFont: font } } })}
                    label="Heading Font (Google Fonts)"
                    type="heading"
                  />
                  <FontPicker
                    value={config.theme.fonts.bodyFont}
                    onChange={(font) => setConfig({ ...config, theme: { ...config.theme, fonts: { ...config.theme.fonts, bodyFont: font } } })}
                    label="Body Font (Google Fonts)"
                    type="body"
                  />
                </div>
                <div>
                  <FontPicker
                    value={config.theme.fonts.logoFont}
                    onChange={(font) => setConfig({ ...config, theme: { ...config.theme, fonts: { ...config.theme.fonts, logoFont: font } } })}
                    label="Navbar Logo Font (Google Fonts)"
                    type="logo"
                  />
                </div>
              </div>

              {/* Light Mode Colors */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="text-md font-semibold mb-4">Light Mode Colors</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.lightMode.primaryColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, primaryColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.lightMode.primaryColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, primaryColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.lightMode.backgroundColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, backgroundColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.lightMode.backgroundColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, backgroundColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.lightMode.textColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, textColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.lightMode.textColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, textColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.lightMode.accentColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, accentColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.lightMode.accentColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, lightMode: { ...config.theme.lightMode, accentColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Mode Colors */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="text-md font-semibold mb-4">Dark Mode Colors</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.darkMode.primaryColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, primaryColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.darkMode.primaryColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, primaryColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.darkMode.backgroundColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, backgroundColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.darkMode.backgroundColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, backgroundColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.darkMode.textColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, textColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.darkMode.textColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, textColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#f9fafb"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.theme.darkMode.accentColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, accentColor: e.target.value } } })}
                        className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.darkMode.accentColor}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, darkMode: { ...config.theme.darkMode, accentColor: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                        placeholder="#9ca3af"
                      />
                    </div>
                  </div>
                </div>
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
