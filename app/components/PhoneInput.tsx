'use client';

import { useState, useEffect } from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export default function PhoneInput({ value, onChange, className = '', error }: PhoneInputProps) {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    // Initialize local value from prop
    if (value.startsWith('+251')) {
      const stripped = value.slice(4);
      setLocalValue(stripped.startsWith('9') || stripped.startsWith('7') ? `0${stripped}` : stripped);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Handle various input formats
    if (newValue.startsWith('251')) {
      newValue = newValue.slice(3);
    }

    // Ensure proper format (09 or 07)
    if (newValue.length > 0) {
      if (!newValue.startsWith('0')) {
        if (newValue.startsWith('9') || newValue.startsWith('7')) {
          newValue = `0${newValue}`;
        }
      }
    }

    // Limit length
    newValue = newValue.slice(0, 10);
    setLocalValue(newValue);

    // Update parent with international format only if valid
    if (isValidNumber(newValue)) {
      onChange(`+251${newValue.slice(1)}`);
    } else {
      onChange('');
    }
  };

  const isValidNumber = (num: string): boolean => {
    return num.length === 10 && (num.startsWith('09') || num.startsWith('07'));
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <div className="flex items-center gap-1">
          <PhoneIcon className="w-5 h-5 text-theme-secondary" />
          <span className="text-gray-600 dark:text-gray-400">+251</span>
        </div>
      </div>
      <input
        type="tel"
        value={localValue}
        onChange={handleChange}
        className={`
          w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-20
          text-gray-600 dark:text-gray-400 border
          ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}
          focus:outline-none focus:border-primary
          ${className}
        `}
        placeholder="09XXXXXXXX"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 