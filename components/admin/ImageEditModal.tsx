'use client';

import { useState, useEffect } from 'react';
import { Image, Category } from '@/types';

interface ImageEditModalProps {
  image: Image;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export default function ImageEditModal({
  image,
  categories,
  isOpen,
  onClose,
  onUpdateSuccess,
}: ImageEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    featured: false,
    selectedCategoryIds: [] as string[],
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form data when image changes
  useEffect(() => {
    if (image) {
      // Support both old and new schema
      const categoryIds = image.categoryIds || (image.categoryId ? [image.categoryId] : []);

      setFormData({
        title: image.title || '',
        description: image.description || '',
        location: image.location || '',
        featured: image.featured || false,
        selectedCategoryIds: categoryIds,
      });
    }
  }, [image]);

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCategoryIds.includes(categoryId);
      const newCategoryIds = isSelected
        ? prev.selectedCategoryIds.filter((id) => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId];

      return {
        ...prev,
        selectedCategoryIds: newCategoryIds,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    if (formData.selectedCategoryIds.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Get category slugs from selected IDs
      const selectedCategories = categories.filter((cat) =>
        formData.selectedCategoryIds.includes(cat._id?.toString() || '')
      );
      const categorySlugs = selectedCategories.map((cat) => cat.slug);

      const response = await fetch(`/api/images/${image._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          featured: formData.featured,
          categoryIds: formData.selectedCategoryIds,
          categorySlugs,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Image updated successfully!');
        setTimeout(() => {
          onUpdateSuccess();
          onClose();
        }, 1000);
      } else {
        setError(data.error || 'Failed to update image');
      }
    } catch (err) {
      setError('Failed to update image. Please try again.');
      console.error('Update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Image</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Preview */}
            <div className="flex justify-center">
              <img
                src={image.firebaseUrl}
                alt={image.title}
                className="max-h-48 rounded-lg object-cover"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                id="edit-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded focus:border-gray-900 dark:focus:border-white focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded focus:border-gray-900 dark:focus:border-white focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                id="edit-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded focus:border-gray-900 dark:focus:border-white focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categories * (Select one or more)
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded p-4 max-h-48 overflow-y-auto bg-white dark:bg-gray-800">
                {categories.map((category) => {
                  const categoryId = category._id?.toString() || '';
                  const isChecked = formData.selectedCategoryIds.includes(categoryId);

                  return (
                    <div key={categoryId} className="flex items-center mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        id={`cat-${categoryId}`}
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(categoryId)}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                      <label
                        htmlFor={`cat-${categoryId}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {formData.selectedCategoryIds.length} category(ies)
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                id="edit-featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="edit-featured" className="ml-2 text-sm font-medium">
                Feature this image on homepage
              </label>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded">
                {success}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider"
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
