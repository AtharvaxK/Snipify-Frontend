import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlAPI } from '../api';

export default function Home() {
  const [url, setUrl]         = useState('');
  const [validTime, setValidTime] = useState(1440);
  const [result, setResult]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  const presets = [
    { label: '1 Hour',  value: 60    },
    { label: '24h',     value: 1440  },
    { label: '7 Days',  value: 10080 },
    { label: '30 Days', value: 43200 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult(''); setCopied(false); setLoading(true);
    try {
      const res = await urlAPI.generate({ url, validTime: Number(validTime) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to shorten URL.');
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#23262f] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/logo-wide.png" alt="Snipify" className="h-8 w-auto object-contain mix-blend-screen" />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"  className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
          <Link to="/signup" className="bg-[#b6ff2e] text-[#23262f] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#c8ff5a] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#b6ff2e]/10 border border-[#b6ff2e]/20 rounded-full px-4 py-1.5 text-[#b6ff2e] text-sm font-medium mb-6">
          ⚡ Free URL shortener — no sign-up required
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
          Shorten URLs<br />
          <span className="text-[#b6ff2e]">Instantly</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl">
          Paste any long link below and get a short, shareable URL in seconds. Sign up for analytics, custom subdomains &amp; more.
        </p>

        {/* Shortener Box */}
        <div className="w-full max-w-2xl bg-[#1a1d24] border border-gray-800 rounded-2xl p-8 shadow-2xl text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Your long URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full px-4 py-3 bg-[#23262f] border border-gray-700 rounded-xl focus:outline-none focus:border-[#b6ff2e] text-white placeholder-gray-600 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {presets.map((p) => (
                  <button
                    key={p.value} type="button"
                    onClick={() => setValidTime(p.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      validTime === p.value ? 'bg-[#b6ff2e] text-[#23262f]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="1" value={validTime}
                    onChange={(e) => setValidTime(e.target.value)}
                    className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#b6ff2e]"
                  />
                  <span className="text-gray-500 text-xs">min</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm p-3 rounded-lg">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#b6ff2e] text-[#23262f] font-bold py-3 rounded-xl hover:bg-[#c8ff5a] hover:shadow-[0_0_20px_rgba(182,255,46,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Shortening...' : '⚡ Shorten URL'}
            </button>
          </form>

          {result && (
            <div className="mt-5 p-4 bg-[#23262f] border border-[#b6ff2e]/30 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Your short URL:</p>
              <div className="flex items-center gap-3">
                <a href={result} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-[#b6ff2e] font-mono text-sm break-all hover:underline">
                  {result}
                </a>
                <button onClick={copy}
                  className="shrink-0 px-4 py-2 bg-[#b6ff2e]/10 border border-[#b6ff2e]/30 text-[#b6ff2e] rounded-lg text-sm hover:bg-[#b6ff2e]/20 transition-colors">
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature nudge */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          {[
            { icon: '📊', title: 'Click Analytics',    desc: 'Track clicks and see which countries visit your links' },
            { icon: '🌐', title: 'Custom Subdomains',  desc: 'Get your own branded short URL like john.snipify.com' },
            { icon: '🔑', title: 'API Access',         desc: 'Integrate URL shortening into your own apps via API' },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a1d24] border border-gray-800 rounded-xl p-4">
              <p className="text-2xl mb-2">{f.icon}</p>
              <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-gray-500 text-xs">{f.desc}</p>
              <Link to="/signup" className="text-[#b6ff2e] text-xs hover:underline mt-2 inline-block">Sign up free →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
