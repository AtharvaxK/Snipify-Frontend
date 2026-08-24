import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#1a1d24] border border-gray-800 rounded-xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#b6ff2e]/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [totalClicks, setTotalClicks] = useState(null);
  const [clicks30, setClicks30] = useState(null);
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [t, t30, c] = await Promise.allSettled([
          analyticsAPI.getTotalClicks(),
          analyticsAPI.getClicks30(),
          analyticsAPI.getCountryAnalytics(),
        ]);
        if (t.status === 'fulfilled') setTotalClicks(t.value.data);
        if (t30.status === 'fulfilled') setClicks30(t30.value.data);
        if (c.status === 'fulfilled') setCountries(c.value.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const countryList = Object.entries(countries).sort(([, a], [, b]) => b - a);
  const total = countryList.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Detailed click and geographic data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard label="Total Clicks (All Time)" value={loading ? '...' : totalClicks} icon="👆" />
        <StatCard label="Clicks (Last 30 Days)" value={loading ? '...' : clicks30} icon="📅" />
      </div>

      {/* Country breakdown */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Clicks by Country</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : countryList.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-5xl mb-3">🌍</p>
            <p className="text-gray-500">No geographic data available yet.</p>
            <p className="text-gray-600 text-sm mt-1">Data will appear as people click your links</p>
          </div>
        ) : (
          <div className="space-y-4">
            {countryList.map(([country, count], idx) => (
              <div key={country} className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-5 text-right">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-200 font-medium">{country}</span>
                    <span className="text-gray-400">{count} clicks · {((count / total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#b6ff2e] to-[#7ec900] rounded-full"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
