'use client';

import { useState, useCallback, useEffect } from 'react';
import { Category } from '@/types';

interface ImageUploadProps {
  categories: Category[];
  onUploadSuccess: () => void;
}

export default function ImageUpload({ categories, onUploadSuccess }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [storageInfo, setStorageInfo] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedCategoryIds: [] as string[],
    location: '',
    featured: false,
  });

  // Fetch storage info on mount
  useEffect(() => {
    fetch('/api/upload')
      .then((res) => res.json())
      .then((data) => {
        setStorageInfo(data.message);
      });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // Auto-fill title from filename
    if (!formData.title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        title: nameWithoutExt.replace(/[-_]/g, ' '),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

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
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (formData.selectedCategoryIds.length === 0 || !formData.title) {
      setError('Please fill in all required fields and select at least one category');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Get category slugs from selected IDs
      const selectedCategories = categories.filter((cat) =>
        formData.selectedCategoryIds.includes(cat._id?.toString() || '')
      );
      const categorySlugs = selectedCategories.map((cat) => cat.slug);

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('categoryIds', JSON.stringify(formData.selectedCategoryIds));
      uploadFormData.append('categorySlugs', JSON.stringify(categorySlugs));
      uploadFormData.append('location', formData.location);
      uploadFormData.append('featured', formData.featured.toString());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Image uploaded successfully to ${data.storage} storage!`);
        setFile(null);
        setPreview(null);
        setFormData({
          title: '',
          description: '',
          selectedCategoryIds: [],
          location: '',
          featured: false,
        });
        onUploadSuccess();
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>

      {storageInfo && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-800 dark:text-blue-300">{storageInfo}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium mb-2">Image File *</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{file?.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
            placeholder="e.g., Manhattan Skyline"
          />
        </div>

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
                    id={`upload-cat-${categoryId}`}
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(categoryId)}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label
                    htmlFor={`upload-cat-${categoryId}`}
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
            placeholder="Optional description..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:outline-none"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium">
              Feature this image on homepage
            </label>
          </div>
        </div>

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

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
}
