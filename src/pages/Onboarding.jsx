import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Alert } from '../components/Alert';

export default function Onboarding() {
  const [userName, setUserName]   = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  // Check if user actually needs onboarding (arrived via OAuth redirect)
  const [checking, setChecking]   = useState(true);
  const { fetchMe } = useAuth();
  const navigate = useNavigate();

  // On mount: verify the user has a session and actually needs onboarding
  useEffect(() => {
    authAPI.me()
      .then((res) => {
        const user = res.data;
        if (!user.needsOnboarding) {
          // Already onboarded – redirect them to proper dashboard
          navigate(user.roles?.includes('ADMIN') ? '/admin' : '/dashboard', { replace: true });
        }
      })
      .catch(() => {
        // No session – send to login
        navigate('/login', { replace: true });
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  const handleOnboard = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.onboard({ userName, subdomain });
      await fetchMe(); // refresh auth context
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response?.status === 406) {
        setError('Username or subdomain is already taken. Please choose another.');
      } else {
        setError('Onboarding failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#23262f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#b6ff2e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23262f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo-icon.png" alt="Snipify" className="w-16 h-16 mx-auto mb-4 object-contain rounded-2xl" />
          <h1 className="text-3xl font-bold text-white">One last step!</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Set up your username and personal subdomain to complete your profile.
          </p>
        </div>

        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Info card */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#b6ff2e]/10 border border-[#b6ff2e]/20 mb-6">
            <span className="text-[#b6ff2e] text-lg mt-0.5">✦</span>
            <div>
              <p className="text-sm text-gray-200 font-medium mb-1">Your personalized short URL</p>
              <code className="text-[#b6ff2e] bg-[#23262f] px-2 py-0.5 rounded text-xs font-mono">
                snipify.com/<span className="opacity-70">{subdomain || 'yourname'}</span>/abc123
              </code>
            </div>
          </div>

          <Alert type="error" message={error} />

          <form onSubmit={handleOnboard} className="space-y-4 mt-4">
            <InputField
              label="Username"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="johndoe"
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Workspace Subdomain</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-[#b6ff2e] focus-within:ring-1 focus-within:ring-[#b6ff2e]/30 transition-colors">
                <input
                  type="text" required value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="myworkspace"
                  className="flex-1 px-4 py-2.5 bg-[#1a1d24] text-white placeholder-gray-600 outline-none"
                />
                <span className="bg-gray-800 text-gray-400 text-sm px-3 flex items-center border-l border-gray-700">
                  .snipify.com
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={loading} className="mt-4">
              {loading ? 'Setting up...' : 'Complete Setup →'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
