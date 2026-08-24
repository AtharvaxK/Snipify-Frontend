import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';

function StatCard({ label, value, icon, color = 'lime' }) {
  const colors = {
    lime:   'bg-[#b6ff2e]/10 border-[#b6ff2e]/20 text-[#b6ff2e]',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  };
  return (
    <div className="bg-[#1a1d24] border border-gray-800 rounded-xl p-6">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border text-xl mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-4xl font-black text-white mb-1">{value ?? '—'}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    adminAPI.dashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load admin stats.'))
      .finally(() => setLoading(false));
  }, []);

  const countryList = stats ? Object.entries(stats.countryAnalytics || {}).slice(0, 8) : [];
  const maxClicks = Math.max(...countryList.map(([, v]) => v), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#b6ff2e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-xl">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Platform-wide statistics and overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"           value={stats?.totalUsers}         icon="👥" color="lime" />
        <StatCard label="Total URLs"            value={stats?.totalUrls}          icon="🔗" color="blue" />
        <StatCard label="Total Clicks"          value={stats?.totalClicks}        icon="👆" color="purple" />
        <StatCard label="Clicks (Last 30 Days)" value={stats?.totalClicksIn30Days} icon="📈" color="orange" />
      </div>

      {/* Country breakdown */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">🌍 Global Click Distribution</h2>
        {countryList.length === 0 ? (
          <p className="text-gray-500 text-sm">No geographic data yet.</p>
        ) : (
          <div className="space-y-4">
            {countryList.map(([country, count]) => (
              <div key={country} className="flex items-center gap-4">
                <span className="text-gray-300 text-sm w-32 shrink-0">{country}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#b6ff2e] to-[#7ec900] rounded-full transition-all"
                    style={{ width: `${(count / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-16 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
