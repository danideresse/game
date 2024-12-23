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
    // Initialize local value from prop, stripping +251 if present
    if (value.startsWith('+251')) {
      let stripped = value.slice(4);
      // Add leading 0 if number starts with 9 or 7
      if (stripped.startsWith('9') || stripped.startsWith('7')) {
        stripped = '0' + stripped;
      }
      setLocalValue(stripped);
    } else {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Remove any non-digit characters
    newValue = newValue.replace(/\D/g, '');

    // Handle different input formats
    if (newValue.startsWith('251')) {
      newValue = '0' + newValue.slice(3);
    }

    // Validate starting digits
    if (newValue.length > 0) {
      if (!newValue.startsWith('09') && !newValue.startsWith('07')) {
        if (newValue.startsWith('9') || newValue.startsWith('7')) {
          newValue = '0' + newValue;
        } else if (!newValue.startsWith('0')) {
          newValue = '';
        }
      }
    }

    // Limit to 10 digits (including leading 0)
    newValue = newValue.slice(0, 10);

    setLocalValue(newValue);
    
    // Call parent onChange with full formatted number
    if (newValue.length === 10) {
      // Convert to international format for storage
      onChange(`+251${newValue.slice(1)}`);
    } else {
      onChange('');
    }
  };

  const isValidNumber = (num: string) => {
    if (num.length !== 10) return false;
    return num.startsWith('09') || num.startsWith('07');
  };

  const getInputStyles = () => {
    const baseStyles = `w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-20 
      text-gray-600 dark:text-gray-400 border transition-all duration-200`;

    if (error || (!isValidNumber(localValue) && localValue.length > 0)) {
      return `${baseStyles} border-red-500 focus:border-red-500`;
    }

    return `${baseStyles} border-gray-200 dark:border-white/10 focus:border-primary`;
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
        <PhoneIcon className="w-5 h-5 text-theme-secondary" />
        <span className="text-gray-600 dark:text-gray-400">+251</span>
      </div>
      <input
        type="tel"
        value={localValue}
        onChange={handleChange}
        className={`${getInputStyles()} ${className}`}
        placeholder="09XXXXXXXX"
      />
      {(error || (!isValidNumber(localValue) && localValue.length > 0)) && (
        <p className="text-red-500 text-sm mt-1">
          {error || 'Please enter a valid phone number (e.g., 09XXXXXXXX)'}
        </p>
      )}
    </div>
  );
} 