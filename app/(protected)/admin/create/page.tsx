'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Link as LinkIcon, Loader2, CheckCircle, Download, ExternalLink } from 'lucide-react';

interface CreatedLink {
    shortCode: string;
    shortUrl: string;
    destinationUrl: string;
    qrImageUrl: string;
    createdAt: string;
}

export default function CreateQRPage() {
    const router = useRouter();
    const [destinationUrl, setDestinationUrl] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsCreating(true);

        // Basic URL validation
        try {
            new URL(destinationUrl);
        } catch {
            setError('Please enter a valid URL (must include http:// or https://)');
            setIsCreating(false);
            return;
        }

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationUrl }),
            });

            if (!res.ok) {
                throw new Error('Failed to create QR code');
            }

            const data = await res.json();
            console.log("Data: ", data)
            setCreatedLink(data.link);
            setDestinationUrl('');
        } catch (err) {
            setError('Failed to create QR code. Please try again.');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

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
                        Create Dynamic QR Code
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!createdLink ? (
                    /* Create Form */
                    <div className="bg-white rounded-lg shadow p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Enter Destination URL
                            </h2>
                            <p className="text-gray-600">
                                This URL can be updated anytime without changing the QR code
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="destination"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Destination URL *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="destination"
                                        type="url"
                                        value={destinationUrl}
                                        onChange={(e) => setDestinationUrl(e.target.value)}
                                        placeholder="https://example.com/page"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Must start with http:// or https://
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isCreating || !destinationUrl}
                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating QR Code...
                                    </>
                                ) : (
                                    'Generate Dynamic QR Code'
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Success Display */
                    <div className="space-y-6">
                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center gap-4">
                            <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                            <div>
                                <h3 className="font-semibold text-green-900 mb-1">
                                    QR Code Created Successfully!
                                </h3>
                                <p className="text-green-700">
                                    Your dynamic QR code is ready to use
                                </p>
                            </div>
                        </div>

                        {/* QR Code Display */}
                        <div className="bg-white rounded-lg shadow p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* QR Image */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        QR Code Image
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                                        <img
                                            src={createdLink.qrImageUrl}
                                            alt="QR Code"
                                            className="w-64 h-64"
                                        />
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <a
                                            href={createdLink.qrImageUrl}
                                            download
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PNG
                                        </a>
                                        <a
                                            href={createdLink.qrImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Open
                                        </a>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short Code
                                        </label>
                                        <div className="flex gap-2">
                                            <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                                                {createdLink.shortCode}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(createdLink.shortCode)}
                                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={createdLink.shortUrl}
                                                readOnly
                                                className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(createdLink.shortUrl)}
                                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Destination URL
                                        </label>
                                        <div className="bg-gray-100 px-3 py-2 rounded border text-sm break-all">
                                            {createdLink.destinationUrl}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={() =>
                                                router.push(`/manage/${createdLink.shortCode}`)
                                            }
                                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                                        >
                                            Manage This QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Create Another */}
                        <div className="text-center">
                            <button
                                onClick={() => setCreatedLink(null)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Create Another QR Code
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}