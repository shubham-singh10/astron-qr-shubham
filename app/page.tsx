'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import { NavBar } from '@/components/Navbar';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!inputValue.trim()) {
      alert('Please enter text or URL');
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(inputValue, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('QR Generation Error:', error);
      alert('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Free QR Code Generator
          </h2>
          <p className="text-lg text-gray-600">
            Create high-quality QR codes instantly. No registration required.
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            {/* Input */}
            <div>
              <label
                htmlFor="qr-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Text or URL
              </label>
              <input
                id="qr-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                onKeyPress={(e) => e.key === 'Enter' && generateQR()}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        {qrDataUrl && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Your QR Code is Ready!
            </h3>

            <div className="inline-block p-6 bg-gray-50 rounded-xl mb-6">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-64 h-64 mx-auto"
              />
            </div>

            <button
              onClick={downloadQR}
              className="inline-flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>

            {/* Upsell Dynamic QR */}
            <div className="mt-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                🚀 Want Dynamic QR Codes?
              </h4>
              <p className="text-gray-700 text-sm mb-4">
                Create QR codes with updatable links. Change the destination URL anytime without reprinting!
              </p>
              <a
                href="/register"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create Admin Account
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Astron Financials. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}