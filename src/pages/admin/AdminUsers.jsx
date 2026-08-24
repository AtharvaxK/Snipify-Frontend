import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [keyword, setKeyword]   = useState('');
  const [search, setSearch]     = useState(''); // committed search term
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(null);
  // Selected user for detail view
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(async (p = 0, kw = search) => {
    setLoading(true); setError('');
    try {
      const res = kw
        ? await adminAPI.searchUsers(kw, p)
        : await adminAPI.getUsers(p);
      setUsers(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
      setPage(p);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(0, ''); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(keyword);
    fetchUsers(0, keyword);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await adminAPI.deleteById(id);
      setUsers((prev) => prev.filter((u) => u.Id !== id));
    } catch {
      setError('Failed to delete user.');
    } finally {
      setDeleting(null); }
  };

  const viewDetail = async (userId) => {
    setSelected(userId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await adminAPI.userDashboard(userId);
      setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">View, search, and manage all platform users</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-xl mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-2 bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-800">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by name, email, username..."
                className="flex-1 px-4 py-2 bg-[#23262f] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#b6ff2e] transition-colors"
              />
              <button type="submit"
                className="px-4 py-2 bg-[#b6ff2e] text-[#23262f] text-sm font-bold rounded-lg hover:bg-[#c8ff5a] transition-colors">
                Search
              </button>
              {search && (
                <button type="button"
                  onClick={() => { setKeyword(''); setSearch(''); fetchUsers(0, ''); }}
                  className="px-3 py-2 bg-gray-800 text-gray-400 text-sm rounded-lg hover:bg-gray-700 transition-colors">
                  ✕
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found.</div>
          ) : (
            <>
              {users.map((u) => (
                <div
                  key={u.Id}
                  onClick={() => viewDetail(u.Id)}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-gray-800 cursor-pointer transition-colors ${
                    selected === u.Id ? 'bg-[#b6ff2e]/5' : 'hover:bg-gray-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#b6ff2e]/20 border border-[#b6ff2e]/30 flex items-center justify-center text-[#b6ff2e] font-bold text-sm shrink-0">
                    {u.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{u.username || <span className="text-gray-500 italic">no username</span>}</p>
                    <p className="text-gray-500 text-xs truncate">{u.email}</p>
                    {u.subDomain && (
                      <p className="text-[#b6ff2e] text-xs font-mono">{u.subDomain}.snipify.com</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">#{u.Id}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(u.Id); }}
                      disabled={deleting === u.Id}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete user"
                    >
                      {deleting === u.Id ? '...' : '🗑'}
                    </button>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3">
                  <button onClick={() => fetchUsers(page - 1)} disabled={page === 0}
                    className="text-xs text-gray-400 hover:text-white disabled:opacity-30">← Prev</button>
                  <span className="text-gray-500 text-xs">Page {page + 1} of {totalPages}</span>
                  <button onClick={() => fetchUsers(page + 1)} disabled={page >= totalPages - 1}
                    className="text-xs text-gray-400 hover:text-white disabled:opacity-30">Next →</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* User Detail Panel */}
        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
          {!selected ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👆</p>
              <p className="text-gray-500 text-sm">Click a user to see their stats</p>
            </div>
          ) : detailLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-[#b6ff2e] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : !detail ? (
            <div className="text-center py-12 text-gray-500 text-sm">Could not load user stats.</div>
          ) : (
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">{detail.Username || detail.username}</h3>
              <div className="space-y-3 mb-6">
                <div className="bg-[#23262f] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-gray-200 text-sm">{detail.email}</p>
                </div>
                <div className="bg-[#23262f] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Subdomain</p>
                  <p className="text-[#b6ff2e] text-sm font-mono">{detail.subdomain || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#23262f] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{detail.totalUrls}</p>
                    <p className="text-xs text-gray-500">Total URLs</p>
                  </div>
                  <div className="bg-[#23262f] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{detail.totalClicksIn30day}</p>
                    <p className="text-xs text-gray-500">Clicks (30d)</p>
                  </div>
                </div>
              </div>
              {detail.countryAnalytics && Object.keys(detail.countryAnalytics).length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Top Countries</p>
                  <div className="space-y-2">
                    {Object.entries(detail.countryAnalytics).slice(0, 5).map(([c, v]) => (
                      <div key={c} className="flex justify-between text-xs">
                        <span className="text-gray-300">{c}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
