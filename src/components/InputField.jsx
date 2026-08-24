import React from 'react';

export default function InputField({ label, type = 'text', value, onChange, placeholder, required, children, className = '' }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      )}
      <div className="flex">
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-[#1a1d24] border border-gray-700 rounded-lg focus:outline-none focus:border-[#b6ff2e] focus:ring-1 focus:ring-[#b6ff2e]/30 text-white placeholder-gray-600 transition-colors ${className}`}
        />
        {children}
      </div>
    </div>
  );
}
