import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * requireRole: 'any' | 'ADMIN' | 'PRO'
 * Redirects to /login if not authenticated.
 * Redirects to /onboard if onboarding incomplete.
 * Redirects to /dashboard or /admin based on role if wrong section.
 */
export default function ProtectedRoute({ children, requireRole = 'any' }) {
  const { user, loading, isAdmin, needsOnboarding } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23262f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#b6ff2e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (needsOnboarding && !isAdmin) return <Navigate to="/onboard" replace />;

  if (requireRole === 'ADMIN' && !isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
