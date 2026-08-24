import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userNav = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '◈' },
  { to: '/shorten',    label: 'Shorten URL',  icon: '⚡' },
  { to: '/my-links',   label: 'My Links',     icon: '🔗' },
  { to: '/analytics',  label: 'Analytics',    icon: '📊' },
  { to: '/api-key',    label: 'API Key',      icon: '🔑' },
];

const adminNav = [
  { to: '/admin',           label: 'Admin Dashboard', icon: '◈' },
  { to: '/admin/users',     label: 'Users',           icon: '👥' },
  { to: '/shorten',         label: 'Shorten URL',     icon: '⚡' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navLinks = isAdmin ? adminNav : userNav;

  return (
    <aside className="w-64 min-h-screen bg-[#1a1d24] border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="block">
          <div className="flex items-center gap-2">
            <img src="/logo-wide.png" alt="Snipify" className="h-10 w-auto object-contain mix-blend-screen" />
            {isAdmin && (
              <span className="text-[10px] bg-[#b6ff2e] text-[#23262f] px-1.5 py-0.5 rounded font-bold uppercase self-end mb-1 shrink-0">Admin</span>
            )}
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#b6ff2e]/20 border border-[#b6ff2e]/30 flex items-center justify-center text-[#b6ff2e] font-bold text-sm shrink-0">
            {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.username || 'User'}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#b6ff2e]/10 text-[#b6ff2e] border border-[#b6ff2e]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Subdomain badge for PRO */}
      {!isAdmin && user?.subdomain && (
        <div className="px-4 pb-3">
          <div className="bg-[#b6ff2e]/5 border border-[#b6ff2e]/15 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Your subdomain</p>
            <p className="text-[#b6ff2e] text-xs font-mono">{user.subdomain}.snipify.com</p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <span>⏻</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
