import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Alert } from '../components/Alert';

// Spring can return exceptions as { message: "..." } objects or plain strings
const parseError = (err, fallback) => {
  const data = err.response?.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  return fallback;
};

const STEPS = ['Email', 'Verify OTP', 'New Password'];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clear = () => { setError(''); setMessage(''); };

  const handleSendOtp = async (e) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setMessage(typeof res.data === 'string' ? res.data : 'OTP sent to your email!');
      setStep(1);
    } catch (err) {
      setError(parseError(err, 'Failed to send OTP.'));
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      const res = await authAPI.verifyOtp({ email, otp });
      setMessage(typeof res.data === 'string' ? res.data : 'OTP verified!');
      setStep(2);
    } catch (err) {
      setError(parseError(err, 'Invalid or expired OTP.'));
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      const res = await authAPI.resetPassword({ email, newPassword });
      setMessage(typeof res.data === 'string' ? res.data : 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(parseError(err, 'Failed to reset password.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#23262f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo-icon.png" alt="Snipify" className="w-16 h-16 mx-auto mb-4 object-contain rounded-2xl" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-1 text-sm">We'll send an OTP to your email</p>
        </div>

        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step ? 'bg-[#b6ff2e] text-[#23262f]' :
                    i === step ? 'border-2 border-[#b6ff2e] text-[#b6ff2e]' :
                    'border-2 border-gray-700 text-gray-600'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 ${i === step ? 'text-[#b6ff2e]' : 'text-gray-600'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-[#b6ff2e]' : 'bg-gray-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <Alert type="error" message={error} />
          <Alert type="success" message={message} />

          <div className="mt-4">
            {step === 0 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <InputField label="Email Address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</Button>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-gray-400">Enter the 6-digit OTP sent to <span className="text-white font-medium">{email}</span></p>
                <InputField label="OTP Code" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="tracking-[0.5em] text-center text-xl" />
                <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
                <Button variant="ghost" onClick={() => { setStep(0); clear(); }}>← Go back</Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleReset} className="space-y-4">
                <InputField label="New Password" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-[#b6ff2e] hover:underline">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
