'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PhoneIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CodeSentSuccess from '../components/CodeSentSuccess';
import PhoneInput from '../components/PhoneInput';

type Step = 'phone' | 'verify' | 'reset';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validatePhone = (number: string) => {
    const phoneRegex = /^\+251[0-9]{9}$/;
    return phoneRegex.test(number);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(phone)) {
      setError('Please enter a valid Ethiopian phone number');
      return;
    }

    setIsLoading(true);
    // Here you would typically make an API call to send verification code
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    // Here you would verify the code with your API
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Here you would reset the password via API
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setStep('verify');
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <form className="space-y-6" onSubmit={handleSendCode}>
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Phone Number
              </label>
              <PhoneInput
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  setError('');
                }}
                error={error}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-300
                bg-gradient-to-r from-primary to-orange-500
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {isLoading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        );

      case 'verify':
        return (
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 
                  text-center text-2xl tracking-widest text-gray-300 dark:text-gray-400"
                placeholder="000000"
                required
              />
              <p className="text-sm text-theme-secondary mt-2 text-center">
                Enter the 6-digit code sent to {phone}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-300
                bg-gradient-to-r from-primary to-orange-500
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        );

      case 'reset':
        return (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 rounded-lg p-3 pl-10 text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 rounded-lg p-3 pl-10 text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-300
                bg-gradient-to-r from-primary to-orange-500
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 card p-6 md:p-8">
        <div className="relative">
          <Link
            href="/login"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-theme-secondary 
              hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">Reset Password</h2>
            <p className="mt-2 text-theme-secondary">
              {step === 'phone' && "We'll send you a verification code"}
              {step === 'verify' && 'Enter the verification code'}
              {step === 'reset' && 'Choose a new password'}
            </p>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {renderStep()}
      </div>

      {showSuccess && (
        <CodeSentSuccess 
          phone={phone}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
} 