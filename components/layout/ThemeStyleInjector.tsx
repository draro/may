'use client';

import { useEffect, useState } from 'react';
import { SiteConfig } from '@/models/SiteConfig';

export default function ThemeStyleInjector() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    // Fetch site configuration
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('Error fetching theme config:', err));
  }, []);

  useEffect(() => {
    if (!config || !config.theme) return;

    // Create or update style element for custom theme
    let styleEl = document.getElementById('custom-theme-styles') as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-theme-styles';
      document.head.appendChild(styleEl);
    }

    // Load Google Fonts dynamically
    const loadFont = (fontName: string, id: string) => {
      const existingLink = document.getElementById(id);
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    };

    loadFont(config.theme.fonts.headingFont, 'custom-heading-font');
    loadFont(config.theme.fonts.bodyFont, 'custom-body-font');

    // Inject custom CSS variables
    styleEl.textContent = `
      :root {
        --custom-heading-font: "${config.theme.fonts.headingFont}", serif;
        --custom-body-font: "${config.theme.fonts.bodyFont}", sans-serif;

        /* Light Mode */
        --custom-light-primary: ${config.theme.lightMode.primaryColor};
        --custom-light-bg: ${config.theme.lightMode.backgroundColor};
        --custom-light-text: ${config.theme.lightMode.textColor};
        --custom-light-accent: ${config.theme.lightMode.accentColor};

        /* Dark Mode */
        --custom-dark-primary: ${config.theme.darkMode.primaryColor};
        --custom-dark-bg: ${config.theme.darkMode.backgroundColor};
        --custom-dark-text: ${config.theme.darkMode.textColor};
        --custom-dark-accent: ${config.theme.darkMode.accentColor};
      }

      /* Apply fonts */
      h1, h2, h3, h4, h5, h6, .font-heading {
        font-family: var(--custom-heading-font) !important;
      }

      body {
        font-family: var(--custom-body-font) !important;
      }

      /* Apply Light Mode Colors */
      :root:not(.dark) {
        --background: ${config.theme.lightMode.backgroundColor};
        --foreground: ${config.theme.lightMode.textColor};
      }

      :root:not(.dark) .bg-white {
        background-color: ${config.theme.lightMode.backgroundColor} !important;
      }

      :root:not(.dark) .text-gray-900 {
        color: ${config.theme.lightMode.primaryColor} !important;
      }

      :root:not(.dark) .text-gray-600 {
        color: ${config.theme.lightMode.accentColor} !important;
      }

      :root:not(.dark) .bg-gray-900 {
        background-color: ${config.theme.lightMode.primaryColor} !important;
      }

      :root:not(.dark) .border-gray-900 {
        border-color: ${config.theme.lightMode.primaryColor} !important;
      }

      /* Apply Dark Mode Colors */
      :root.dark {
        --background: ${config.theme.darkMode.backgroundColor};
        --foreground: ${config.theme.darkMode.textColor};
      }

      :root.dark .dark\\:bg-gray-900 {
        background-color: ${config.theme.darkMode.backgroundColor} !important;
      }

      :root.dark .dark\\:text-white {
        color: ${config.theme.darkMode.primaryColor} !important;
      }

      :root.dark .dark\\:text-gray-400 {
        color: ${config.theme.darkMode.accentColor} !important;
      }

      :root.dark .dark\\:bg-white {
        background-color: ${config.theme.darkMode.primaryColor} !important;
      }

      :root.dark .dark\\:border-white {
        border-color: ${config.theme.darkMode.primaryColor} !important;
      }
    `;
  }, [config]);

  return null; // This component only injects styles
}
