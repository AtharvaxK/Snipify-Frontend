import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Public
import Home          from './pages/Home';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding    from './pages/Onboarding';

// PRO user pages
import Dashboard     from './pages/Dashboard';
import ShortenUrl    from './pages/ShortenUrl';
import MyLinks       from './pages/MyLinks';
import Analytics     from './pages/Analytics';
import ApiKey        from './pages/ApiKey';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ── Public routes ── */}
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Onboarding handles its own /auth/me check on mount */}
          <Route path="/onboard"        element={<Onboarding />} />

          {/* ── PRO user routes (any authenticated user) ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          }/>
          <Route path="/shorten" element={
            <ProtectedRoute>
              <AppLayout><ShortenUrl /></AppLayout>
            </ProtectedRoute>
          }/>
          <Route path="/my-links" element={
            <ProtectedRoute>
              <AppLayout><MyLinks /></AppLayout>
            </ProtectedRoute>
          }/>
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppLayout><Analytics /></AppLayout>
            </ProtectedRoute>
          }/>
          <Route path="/api-key" element={
            <ProtectedRoute>
              <AppLayout><ApiKey /></AppLayout>
            </ProtectedRoute>
          }/>

          {/* ── ADMIN only routes ── */}
          <Route path="/admin" element={
            <ProtectedRoute requireRole="ADMIN">
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          }/>
          <Route path="/admin/users" element={
            <ProtectedRoute requireRole="ADMIN">
              <AppLayout><AdminUsers /></AppLayout>
            </ProtectedRoute>
          }/>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
