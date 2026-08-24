import React, { useState } from 'react';
import { urlAPI } from '../api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Alert } from '../components/Alert';

export default function ShortenUrl() {
  const [url, setUrl] = useState('');
  const [validTime, setValidTime] = useState(1440); // minutes, default 24h
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult(''); setCopied(false);
    setLoading(true);
    try {
      const res = await urlAPI.generate({ url, validTime: Number(validTime) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to shorten URL.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: '1 Hour', value: 60 },
    { label: '24 Hours', value: 1440 },
    { label: '7 Days', value: 10080 },
    { label: '30 Days', value: 43200 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Shorten URL</h1>
        <p className="text-gray-400 mt-1">Create a short, shareable link</p>
      </div>

      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-8">
        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <InputField
            label="Long URL"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/that/needs/shortening"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Expiry</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setValidTime(p.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    validTime === p.value
                      ? 'bg-[#b6ff2e] text-[#23262f]'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={validTime}
                onChange={(e) => setValidTime(e.target.value)}
                className="w-32 px-4 py-2 bg-[#23262f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#b6ff2e]"
              />
              <span className="text-gray-400 text-sm">minutes</span>
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Shortening...' : '⚡ Shorten URL'}
          </Button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-[#23262f] border border-[#b6ff2e]/30 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">Your short URL:</p>
            <div className="flex items-center gap-3">
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-[#b6ff2e] font-mono text-sm break-all hover:underline"
              >
                {result}
              </a>
              <button
                onClick={copy}
                className="shrink-0 px-4 py-2 bg-[#b6ff2e]/10 border border-[#b6ff2e]/30 text-[#b6ff2e] rounded-lg text-sm hover:bg-[#b6ff2e]/20 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
