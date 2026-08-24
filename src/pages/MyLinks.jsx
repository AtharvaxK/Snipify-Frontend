import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';
import { Alert } from '../components/Alert';
import Button from '../components/Button';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-500/20 text-green-400 border border-green-500/30',
  EXPIRED: 'bg-red-500/20 text-red-400 border border-red-500/30',
  INACTIVE: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export default function MyLinks() {
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async (p = 0) => {
    setLoading(true); setError('');
    try {
      const res = await analyticsAPI.getMyUrls(p, 10);
      setLinks(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
      setPage(p);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load links.');
      }
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(0); }, []);

  const formatDate = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Links</h1>
        <p className="text-gray-400 mt-1">All your shortened URLs</p>
      </div>

      <Alert type="error" message={error} />

      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading your links...</div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-5xl mb-4">🔗</p>
            <p className="text-gray-400 font-medium">No links yet</p>
            <p className="text-gray-600 text-sm mt-1">Create your first short URL from the Shorten URL page</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-800/50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <div className="col-span-2">Short Code</div>
              <div className="col-span-4">Original URL</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Clicks</div>
              <div className="col-span-2">Expires</div>
            </div>

            {links.map((link) => (
              <div key={link.urlId} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors items-center">
                <div className="col-span-2">
                  <span className="text-[#b6ff2e] font-mono text-sm">/{link.shortCode}</span>
                </div>
                <div className="col-span-4 min-w-0">
                  <p className="text-gray-300 text-sm truncate" title={link.longUrl}>{link.longUrl}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[link.status] || STATUS_COLORS.INACTIVE}`}>
                    {link.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-white font-semibold">{link.clickCount}</span>
                  <span className="text-gray-500 text-xs ml-1">clicks</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs">{formatDate(link.expiryTime)}</span>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4">
                <Button variant="outline" onClick={() => fetchLinks(page - 1)} disabled={page === 0} className="w-auto px-4">
                  ← Prev
                </Button>
                <span className="text-gray-400 text-sm">Page {page + 1} of {totalPages}</span>
                <Button variant="outline" onClick={() => fetchLinks(page + 1)} disabled={page >= totalPages - 1} className="w-auto px-4">
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
