'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category, Image as ImageType } from '@/types';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'images'>('overview');
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [categoriesRes, imagesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/images'),
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(imagesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCategory,
          order: categories.length,
        }),
      });

      if (response.ok) {
        setNewCategory({ name: '', slug: '', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
                View Website
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-b-2 border-gray-900 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 -mb-px ${
              activeTab === 'categories'
                ? 'border-b-2 border-gray-900 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 -mb-px ${
              activeTab === 'images'
                ? 'border-b-2 border-gray-900 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'
            }`}
          >
            Images
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold mb-2">{categories.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold mb-2">{images.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Images</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold mb-2">
                {images.filter((img) => img.featured).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Featured Images</div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-gray-900 focus:outline-none"
                      placeholder="e.g., Architecture"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-gray-900 focus:outline-none"
                      placeholder="e.g., architecture"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-gray-900 focus:outline-none"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">All Categories</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category._id?.toString()} className="p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Slug: {category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category._id?.toString() || '')}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                    No categories yet. Add one above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mb-6 p-6">
              <h2 className="text-xl font-bold mb-4">Image Management</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To add images, upload them to Firebase Storage and use the admin API or create a dedicated upload interface.
              </p>
              <p className="text-sm text-gray-500">
                Note: For production use, implement a proper file upload component with Firebase Storage integration.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">All Images ({images.length})</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {images.map((image) => (
                  <div key={image._id?.toString()} className="border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <img
                      src={image.firebaseUrl}
                      alt={image.title}
                      className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{image.categorySlug}</p>
                      {image.featured && (
                        <span className="inline-block px-2 py-1 bg-gray-900 text-white text-xs">
                          Featured
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image._id?.toString() || '')}
                        className="mt-2 w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8">
                    No images yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
