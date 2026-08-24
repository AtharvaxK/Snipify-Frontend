import React from 'react';

export function Alert({ type = 'error', message }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-500/10 border border-red-500/50 text-red-400',
    success: 'bg-[#b6ff2e]/10 border border-[#b6ff2e]/30 text-[#b6ff2e]',
    info: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
    warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400',
  };
  const icons = {
    error: '✕',
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
  };
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg text-sm ${styles[type]}`}>
      <span className="font-bold mt-0.5">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
