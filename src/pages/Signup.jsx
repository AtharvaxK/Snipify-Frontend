import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Alert } from '../components/Alert';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', subDomain: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Client-side validation
    if (!form.username.trim()) { setError('Username is required.'); return; }
    if (!form.subDomain.trim()) { setError('Subdomain is required.'); return; }

    setLoading(true);
    try {
      const res = await authAPI.signup(form);
      if (typeof res.data === 'string' && res.data.includes('<!DOCTYPE html>')) {
        setError('Request was blocked. The email or username may already exist.');
        return;
      }
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'string' && msg.includes('<!DOCTYPE html>')) {
        setError('Email or username already exists. Try a different one.');
      } else {
        setError(typeof msg === 'string' ? msg : 'Signup failed. Check console for details.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#23262f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo-icon.png" alt="Snipify" className="w-16 h-16 mx-auto mb-4 object-contain rounded-2xl" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-1 text-sm">Start shortening URLs with Snipify</p>
        </div>

        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <Button variant="google" onClick={authAPI.googleLogin}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </Button>
            <Button variant="github" onClick={authAPI.githubLogin}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              Sign up with GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <InputField label="Username" required value={form.username} onChange={handle('username')} placeholder="johndoe" />
            <InputField label="Email" type="email" required value={form.email} onChange={handle('email')} placeholder="you@example.com" />
            <InputField label="Password" type="password" required value={form.password} onChange={handle('password')} placeholder="••••••••" />

            {/* Subdomain */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subdomain <span className="text-red-400">*</span>
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-[#b6ff2e] focus-within:ring-1 focus-within:ring-[#b6ff2e]/30 transition-colors">
                <input
                  type="text"
                  value={form.subDomain}
                  onChange={handle('subDomain')}
                  placeholder="myworkspace"
                  required
                  className="flex-1 px-4 py-2.5 bg-[#1a1d24] text-white placeholder-gray-600 outline-none"
                />
                <span className="bg-gray-800 text-gray-400 text-sm px-3 flex items-center border-l border-gray-700">
                  .snipify.com
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={loading} className="mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#b6ff2e] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
