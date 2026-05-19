"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [content, setContent] = useState({
    hero: { headline: '', subtext: '', ctaText: '' },
    services: { title: '', subtitle: '', services: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]},
    about: { title: '', description: '', yearsExperience: '' }
  });
  
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Fetch Content
      const contentRes = await fetch('/api/content');
      const contentData = await contentRes.json();
      
      if (contentData.success && Object.keys(contentData.data).length > 0) {
        // Merge with defaults in case some fields are missing
        setContent(prev => ({
          ...prev,
          ...contentData.data,
          hero: { ...prev.hero, ...(contentData.data.hero || {}) },
          services: { ...prev.services, ...(contentData.data.services || {}) },
          about: { ...prev.about, ...(contentData.data.about || {}) },
        }));
      }

      // Fetch Submissions
      const submissionsRes = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const submissionsData = await submissionsRes.json();
      
      if (submissionsData.success) {
        setSubmissions(submissionsData.data);
      } else if (submissionsRes.status === 401) {
        // Token invalid/expired
        localStorage.removeItem('admin_token');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: 'Content saved successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('admin_token');
          router.push('/admin');
        }
        setMessage({ text: data.message || 'Failed to save', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  // Helper to handle nested object updates
  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateService = (index, field, value) => {
    const newServices = [...content.services.services];
    newServices[index] = { ...newServices[index], [field]: value };
    
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        services: newServices
      }
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-white">CMS Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank" className="text-indigo-100 hover:text-white text-sm">
                View Site
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`${
                  activeTab === 'content'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Edit Content
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`${
                  activeTab === 'submissions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Form Submissions
              </button>
            </nav>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'content' && (
          <form onSubmit={handleSaveContent} className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Headline</label>
                    <input
                      type="text"
                      value={content.hero.headline}
                      onChange={(e) => updateContent('hero', 'headline', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtext</label>
                    <textarea
                      rows="3"
                      value={content.hero.subtext}
                      onChange={(e) => updateContent('hero', 'subtext', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Call to Action Text</label>
                    <input
                      type="text"
                      value={content.hero.ctaText}
                      onChange={(e) => updateContent('hero', 'ctaText', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">About Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => updateContent('about', 'title', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows="5"
                      value={content.about.description}
                      onChange={(e) => updateContent('about', 'description', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Experience (e.g. "20+")</label>
                    <input
                      type="text"
                      value={content.about.yearsExperience}
                      onChange={(e) => updateContent('about', 'yearsExperience', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Services Section</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Section Title</label>
                      <input
                        type="text"
                        value={content.services.title}
                        onChange={(e) => updateContent('services', 'title', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Section Subtitle</label>
                      <input
                        type="text"
                        value={content.services.subtitle}
                        onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-700 mb-4">Service Items</h4>
                    {content.services.services.map((service, index) => (
                      <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                        <h5 className="text-sm font-medium text-gray-500 mb-3">Service {index + 1}</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => updateService(index, 'title', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Description</label>
                            <textarea
                              rows="2"
                              value={service.description}
                              onChange={(e) => updateService(index, 'description', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pb-12">
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {submissions.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-500">
                No submissions yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <li key={submission._id} className="p-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">{submission.name}</p>
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="truncate">{submission.email}</span>
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                      {submission.message}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
