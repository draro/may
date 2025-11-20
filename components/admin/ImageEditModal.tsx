'use client';

import { useState, useEffect } from 'react';
import { Image as ImageType, Category } from '@/types';

interface ImageEditModalProps {
  image: ImageType;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export default function ImageEditModal({ image, categories, onClose, onSave }: ImageEditModalProps) {
  const [formData, setFormData] = useState({
    title: image.title,
    description: image.description || '',
    location: image.location || '',
    featured: image.featured,
    selectedCategoryIds: image.categoryIds || (image.categoryId ? [image.categoryId] : []),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.includes(categoryId)
        ? prev.selectedCategoryIds.filter(id => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.selectedCategoryIds.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Map category IDs to slugs
      const selectedCategorySlugs = categories
        .filter(cat => formData.selectedCategoryIds.includes(cat._id?.toString() || ''))
        .map(cat => cat.slug);

      const response = await fetch(`/api/images/${image._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          featured: formData.featured,
          categoryIds: formData.selectedCategoryIds,
          categorySlugs: selectedCategorySlugs,
        }),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update image');
      }
    } catch (err) {
      setError('Failed to update image. Please try again.');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Image</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <img
            src={image.firebaseUrl}
            alt={image.title}
            className="w-full max-h-64 object-contain rounded"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none rounded"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none rounded"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categories * (select one or more)
            </label>
            <div className="space-y-2 p-4 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800/50">
              {categories.map((category) => {
                const categoryId = category._id?.toString() || '';
                const isChecked = formData.selectedCategoryIds.includes(categoryId);

                return (
                  <label
                    key={categoryId}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(categoryId)}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({category.slug})</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select all categories this image belongs to. It will appear in all selected category filters.
            </p>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800/50">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
              Feature this image on homepage
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider rounded"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
