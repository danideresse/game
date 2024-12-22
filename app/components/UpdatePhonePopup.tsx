'use client';

import { useState } from 'react';
import { XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface UpdatePhonePopupProps {
  currentPhone: string;
  onClose: () => void;
  onUpdate: (newPhone: string) => void;
}

export default function UpdatePhonePopup({ currentPhone, onClose, onUpdate }: UpdatePhonePopupProps) {
  const [phone, setPhone] = useState(currentPhone);
  const [error, setError] = useState('');

  const validatePhone = (number: string) => {
    const phoneRegex = /^\+251[0-9]{9}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid Ethiopian phone number (+251XXXXXXXXX)');
      return;
    }
    onUpdate(phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-secondary hover:text-primary"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-primary mb-6">Update Phone Number</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-theme-secondary mb-2 block">
              Phone Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                className="w-full bg-white/5 rounded-lg p-3 pl-10 text-white"
                placeholder="+251XXXXXXXXX"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gradient-to-r from-primary to-orange-500 hover:scale-105"
          >
            Update Phone Number
          </button>
        </div>
      </div>
    </div>
  );
} 