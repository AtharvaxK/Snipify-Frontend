import React from 'react';

export default function Button({ children, type = 'button', onClick, disabled, variant = 'primary', className = '' }) {
  const base = 'w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-[#b6ff2e] text-[#23262f] hover:bg-[#c8ff5a] hover:shadow-[0_0_20px_rgba(182,255,46,0.3)]',
    outline: 'border border-[#b6ff2e] text-[#b6ff2e] hover:bg-[#b6ff2e]/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
    danger: 'bg-red-600/20 border border-red-600 text-red-500 hover:bg-red-600/30',
    google: 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300',
    github: 'bg-gray-900 text-white border border-gray-600 hover:bg-gray-800',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
