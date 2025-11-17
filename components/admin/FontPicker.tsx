'use client';

import { useState, useEffect } from 'react';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
  label: string;
  type: 'heading' | 'body' | 'logo';
}

const POPULAR_FONTS = {
  heading: [
    'Playfair Display',
    'Merriweather',
    'Lora',
    'Crimson Text',
    'PT Serif',
    'Libre Baskerville',
    'Spectral',
    'Cormorant Garamond',
    'EB Garamond',
    'Abril Fatface',
  ],
  body: [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Poppins',
    'Montserrat',
    'Source Sans Pro',
    'Raleway',
    'Work Sans',
    'Nunito',
  ],
  logo: [
    'Playfair Display',
    'Merriweather',
    'Lora',
    'Cinzel',
    'Cormorant Garamond',
    'Bebas Neue',
    'Bodoni Moda',
    'Montserrat',
    'Raleway',
    'Great Vibes',
  ],
};

export default function FontPicker({ value, onChange, label, type }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customFont, setCustomFont] = useState('');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  const fonts = POPULAR_FONTS[type];

  // Load font for preview
  const loadFont = (fontName: string) => {
    if (loadedFonts.has(fontName)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;600&display=swap`;
    document.head.appendChild(link);

    setLoadedFonts(prev => new Set([...prev, fontName]));
  };

  useEffect(() => {
    // Load current font
    if (value) {
      loadFont(value);
    }
  }, [value]);

  const handleSelect = (font: string) => {
    loadFont(font);
    onChange(font);
    setIsOpen(false);
  };

  const handleCustomFont = () => {
    if (customFont.trim()) {
      loadFont(customFont);
      onChange(customFont);
      setCustomFont('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>

      {/* Selected Font Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none text-left flex justify-between items-center"
      >
        <span style={{ fontFamily: `"${value}", ${type === 'body' ? 'sans-serif' : 'serif'}` }}>
          {value || 'Select a font'}
        </span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-h-96 overflow-auto">
            {/* Popular Fonts */}
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                Popular {type === 'heading' ? 'Heading' : type === 'body' ? 'Body' : 'Logo'} Fonts
              </div>
              {fonts.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleSelect(font)}
                  onMouseEnter={() => loadFont(font)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === font ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  style={{ fontFamily: `"${font}", ${type === 'body' ? 'sans-serif' : 'serif'}` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-base">{font}</span>
                    {value === font && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The quick brown fox jumps over the lazy dog
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Font Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Google Font</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomFont()}
                  placeholder="Enter font name..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCustomFont}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
