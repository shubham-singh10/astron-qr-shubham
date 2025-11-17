'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, ExternalLink, Download, Clock } from 'lucide-react';

interface Link {
  _id: string;
  shortCode: string;
  destinationUrl: string;
  qrImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManageQRPage() {
  const router = useRouter();
  const [link, setLink] = useState<Link | null>(null);
  const [destinationUrl, setDestinationUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const params = useParams()
  useEffect(() => {
    fetchLink();
  }, [params.code]);

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${params.code}`);
      if (!res.ok) {
        throw new Error('Link not found');
      }
      const data = await res.json();
      setLink(data.link);
      setDestinationUrl(data.link.destinationUrl);
    } catch (err) {
      setError('Failed to load QR code');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsUpdating(true);

    // Validate URL
    try {
      new URL(destinationUrl);
    } catch {
      setError('Please enter a valid URL (must include http:// or https://)');
      setIsUpdating(false);
      return;
    }

    try {
      const res = await fetch(`/api/links/${params.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to update');
      }

      const data = await res.json();
      setLink(data.link);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update URL. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getShortUrl = () => {
    return `${window.location.origin}/q/${params.code}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage QR Code
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Code: <code className="bg-gray-100 px-2 py-1 rounded">{params.code}</code>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: QR Code Display */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                QR Code Image
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center mb-4">
                <img
                  src={link?.qrImageUrl}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <div className="flex gap-3">
                <a
                  href={link?.qrImageUrl}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <a
                  href={link?.qrImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </a>
              </div>
            </div>

            {/* Info Cards */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Code (Read Only)
                </label>
                <div className="flex gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                    {link?.shortCode}
                  </code>
                  <button
                    onClick={() => copyToClipboard(link?.shortCode || '')}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL (Read Only)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={getShortUrl()}
                    readOnly
                    className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(getShortUrl())}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Created: {new Date(link?.createdAt || '').toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated: {new Date(link?.updatedAt || '').toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Update Form */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Update Destination URL
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Change where this QR code redirects to. The QR image remains the same.
              </p>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Destination URL *
                  </label>
                  <input
                    id="destination"
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Must start with http:// or https://
                  </p>
                </div>

                {/* Current URL Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Current URL:
                  </p>
                  <p className="text-sm text-blue-700 break-all">
                    {link?.destinationUrl}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    ✓ URL updated successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUpdating || destinationUrl === link?.destinationUrl}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update URL
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Test Link */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-2">
                🔗 Test Your QR Code
              </p>
              <a
                href={getShortUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 text-sm font-medium"
              >
                {getShortUrl()}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}