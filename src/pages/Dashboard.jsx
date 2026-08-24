import React, { useState, useEffect } from 'react';
import { analyticsAPI, urlAPI } from '../api';
import { Alert } from '../components/Alert';

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="bg-[#1a1d24] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalClicks: null, clicks30: null });
  const [topCountries, setTopCountries] = useState({});
  const [recentUrls, setRecentUrls] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [clicksRes, clicks30Res, countryRes, urlsRes] = await Promise.allSettled([
          analyticsAPI.getTotalClicks(),
          analyticsAPI.getClicks30(),
          analyticsAPI.getCountryAnalytics(),
          analyticsAPI.getMyUrls(0, 5),
        ]);
        if (clicksRes.status === 'fulfilled') setStats(s => ({ ...s, totalClicks: clicksRes.value.data }));
        if (clicks30Res.status === 'fulfilled') setStats(s => ({ ...s, clicks30: clicks30Res.value.data }));
        if (countryRes.status === 'fulfilled') setTopCountries(countryRes.value.data);
        if (urlsRes.status === 'fulfilled') setRecentUrls(urlsRes.value.data?.content || []);
      } finally {
        setLoadingStats(false);
      }
    };
    fetch();
  }, []);

  const topCountryList = Object.entries(topCountries).slice(0, 5);
  const maxClicks = Math.max(...topCountryList.map(([, v]) => v), 1);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your Snipify activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Clicks" value={loadingStats ? '...' : stats.totalClicks} icon="👆" sub="All time" />
        <StatCard label="Clicks (30 days)" value={loadingStats ? '...' : stats.clicks30} icon="📈" sub="Last 30 days" />
        <StatCard label="Recent Links" value={loadingStats ? '...' : recentUrls.length} icon="🔗" sub="Showing latest 5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent URLs */}
        <div className="bg-[#1a1d24] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Links</h2>
          {loadingStats ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : recentUrls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">🔗</p>
              <p className="text-gray-500 text-sm">No links yet. Create your first short URL!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUrls.map((url) => (
                <div key={url.urlId} className="flex items-center justify-between p-3 bg-[#23262f] rounded-lg">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-[#b6ff2e] text-sm font-mono truncate">/{url.shortCode}</p>
                    <p className="text-gray-500 text-xs truncate">{url.longUrl}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-semibold">{url.clickCount}</p>
                    <p className="text-gray-600 text-xs">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country Analytics */}
        <div className="bg-[#1a1d24] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Countries</h2>
          {loadingStats ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : topCountryList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">🌍</p>
              <p className="text-gray-500 text-sm">No click data yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCountryList.map(([country, count]) => (
                <div key={country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{country}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b6ff2e] rounded-full transition-all"
                      style={{ width: `${(count / maxClicks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
